
// This file defines SQL functions to create in Supabase

export const sqlFunctions = `
-- Function to increment property view count
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET view_count = view_count + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment property share count
CREATE OR REPLACE FUNCTION increment_property_shares(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET share_count = share_count + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment share link clicks
CREATE OR REPLACE FUNCTION increment_share_clicks(share_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shares
  SET 
    clicks = clicks + 1,
    last_clicked_at = NOW()
  WHERE code = share_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get broker share stats
CREATE OR REPLACE FUNCTION get_broker_share_stats(broker_id UUID)
RETURNS JSON AS $$
DECLARE
  total_shares INTEGER;
  total_clicks INTEGER;
  active_links INTEGER;
  avg_clicks NUMERIC;
  most_shared RECORD;
BEGIN
  -- Get total shares
  SELECT COUNT(*) INTO total_shares FROM shares WHERE broker_id = $1;
  
  -- Get total clicks
  SELECT COALESCE(SUM(clicks), 0) INTO total_clicks FROM shares WHERE broker_id = $1;
  
  -- Get active links
  SELECT COUNT(*) INTO active_links FROM shares WHERE broker_id = $1 AND is_active = true;
  
  -- Calculate average clicks per share
  IF total_shares > 0 THEN
    avg_clicks := total_clicks::NUMERIC / total_shares;
  ELSE
    avg_clicks := 0;
  END IF;
  
  -- Get most shared property
  SELECT 
    p.id,
    p.title as name,
    COUNT(*) as count
  INTO most_shared
  FROM shares s
  JOIN properties p ON s.property_id = p.id
  WHERE s.broker_id = $1
  GROUP BY p.id, p.title
  ORDER BY count DESC
  LIMIT 1;
  
  -- Return as JSON
  RETURN json_build_object(
    'totalShares', total_shares,
    'totalClicks', total_clicks,
    'activeLinks', active_links,
    'averageClicksPerShare', ROUND(avg_clicks),
    'mostSharedProperty', CASE WHEN most_shared IS NULL THEN 
      json_build_object('id', '', 'name', '', 'count', 0)
    ELSE
      json_build_object('id', most_shared.id, 'name', most_shared.name, 'count', most_shared.count)
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get yearly performance summary
CREATE OR REPLACE FUNCTION get_yearly_performance_summary(broker_id UUID)
RETURNS JSON AS $$
DECLARE
  yearly_data JSON;
BEGIN
  SELECT 
    json_agg(
      json_build_object(
        'year', year,
        'shares', SUM(shares),
        'leads', SUM(leads),
        'schedules', SUM(schedules),
        'visits', SUM(visits),
        'sales', SUM(sales)
      )
    )
  INTO yearly_data
  FROM performance
  WHERE broker_id = $1
  GROUP BY year
  ORDER BY year;
  
  RETURN COALESCE(yearly_data, '[]'::JSON);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      current_setting('request.jwt.claims', true)::json->'user_metadata'->>'role' = 'ADMIN',
      FALSE
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

export const rowLevelSecurityPolicies = `
-- RLS Policies for Properties Table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_properties ON properties
  USING (is_admin())
  WITH CHECK (is_admin());

-- Brokers can see and edit only their properties
CREATE POLICY broker_own_properties ON properties
  USING (created_by_id = auth.uid())
  WITH CHECK (created_by_id = auth.uid());
  
-- Everyone can read active properties
CREATE POLICY read_active_properties ON properties
  FOR SELECT
  USING (is_active = true);

-- RLS Policies for Property Images Table
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_property_images ON property_images
  USING (is_admin())
  WITH CHECK (is_admin());
  
-- Broker can manage images for their properties
CREATE POLICY broker_property_images ON property_images
  USING (
    property_id IN (
      SELECT id FROM properties WHERE created_by_id = auth.uid()
    )
  )
  WITH CHECK (
    property_id IN (
      SELECT id FROM properties WHERE created_by_id = auth.uid()
    )
  );
  
-- Anyone can view images of active properties
CREATE POLICY view_active_property_images ON property_images
  FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE is_active = true
    )
  );

-- RLS Policies for Leads Table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_leads ON leads
  USING (is_admin())
  WITH CHECK (is_admin());
  
-- Brokers can see and manage only their leads
CREATE POLICY broker_own_leads ON leads
  USING (created_by_id = auth.uid() OR assigned_to_id = auth.uid())
  WITH CHECK (created_by_id = auth.uid() OR assigned_to_id = auth.uid());

-- RLS Policies for Shares Table
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_shares ON shares
  USING (is_admin())
  WITH CHECK (is_admin());
  
-- Brokers can see and manage only their shares
CREATE POLICY broker_own_shares ON shares
  USING (broker_id = auth.uid())
  WITH CHECK (broker_id = auth.uid());

-- RLS Policies for Performance Table
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_performance ON performance
  USING (is_admin())
  WITH CHECK (is_admin());
  
-- Brokers can see and manage only their performance
CREATE POLICY broker_own_performance ON performance
  USING (broker_id = auth.uid())
  WITH CHECK (broker_id = auth.uid());

-- RLS Policies for Targets Table
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;

-- Admin has full access
CREATE POLICY admin_all_targets ON targets
  USING (is_admin())
  WITH CHECK (is_admin());
  
-- Brokers can see and manage only their targets
CREATE POLICY broker_own_targets ON targets
  USING (broker_id = auth.uid())
  WITH CHECK (broker_id = auth.uid());
`;
