
import { Performance } from "@/types";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

// Helper to get month name
const getMonthName = (monthNumber: number): string => {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  return months[monthNumber - 1];
};

// Format performance data for exports
const formatPerformanceData = (data: Performance[]): any[] => {
  return data.map(item => ({
    Periodo: item.month ? getMonthName(item.month) : item.year.toString(),
    Compartilhamentos: item.shares,
    Leads: item.leads,
    Agendamentos: item.schedules,
    Visitas: item.visits,
    Vendas: item.sales,
  }));
};

export const exportPerformanceData = {
  toCSV: (data: Performance[], filename = "performance-data.csv"): void => {
    const formattedData = formatPerformanceData(data);
    const csv = Papa.unparse(formattedData);
    
    // Create download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
  
  toPDF: (data: Performance[], title = "Relatório de Desempenho", filename = "performance-data.pdf"): void => {
    const formattedData = formatPerformanceData(data);
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    
    // Add date of generation
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Gerado em: ${today.toLocaleDateString('pt-BR')}`, 14, 30);
    
    // Create table
    (doc as any).autoTable({
      head: [Object.keys(formattedData[0])],
      body: formattedData.map(Object.values),
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 }
    });
    
    doc.save(filename);
  }
};
