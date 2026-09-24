import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PaymentRecord, Apartment, CoProprieteState, Expense, AGTask, BudgetItem } from '../types';
import { formatCurrency, getMonthName } from './formatters';

// Utility for number to French words
function numberToFrenchWords(num: number): string {
  if (num === 0) return 'zéro dirhams';
  if (num === 300) return 'trois cents dirhams';
  if (num === 600) return 'six cents dirhams';
  if (num === 900) return 'neuf cents dirhams';
  if (num === 1200) return 'mille deux cents dirhams';
  if (num === 1800) return 'mille huit cents dirhams';
  if (num === 2500) return 'deux mille cinq cents dirhams';

  return `${num} dirhams`;
}

export const generateReceiptPDF = (
  payment: PaymentRecord,
  apartment: Apartment,
  residence: CoProprieteState
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  // Background card styling
  doc.setFillColor(248, 250, 252);
  doc.rect(5, 5, 138, 200, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(5, 5, 138, 200, 3, 3, 'S');

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Navy 900
  doc.rect(5, 5, 138, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(residence.name.toUpperCase(), 74, 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${residence.city} | Copropriété & Transparence`, 74, 21, { align: 'center' });
  doc.text(`Syndic Pro : ${residence.syndicPro}`, 74, 27, { align: 'center' });

  // Receipt Badge
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.roundedRect(45, 37, 58, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('QUITTANCE DE PAIEMENT', 74, 42.5, { align: 'center' });

  // Receipt Reference & Date
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° Reçu : ${payment.receiptNumber}`, 12, 53);
  doc.text(`Date d'émission : ${payment.paidDate}`, 136, 53, { align: 'right' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(12, 56, 136, 56);

  // Appartement Info Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 60, 124, 25, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Désignation :', 16, 69);
  doc.text('Niveau / Étage :', 16, 78);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${apartment.number}`, 45, 69);
  doc.setFont('helvetica', 'normal');
  doc.text(`Étage ${apartment.floor === 0 ? 'RDC' : apartment.floor}`, 45, 78);

  // Details of Payment
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(12, 95, 124, 48, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Objet du versement :', 16, 103);
  doc.text('Période concernée :', 16, 111);
  doc.text('Mode de règlement :', 16, 119);
  doc.text('Montant réglé :', 16, 127);
  doc.text('Montant en lettres :', 16, 135);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Cotisation mensuelle syndic des charges communes', 50, 103);
  doc.text(`${getMonthName(payment.month)} ${payment.year}`, 50, 111);
  doc.text(`${payment.paymentMethod}`, 50, 119);
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(11);
  doc.text(`${formatCurrency(payment.amount)}`, 50, 127);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.text(numberToFrenchWords(payment.amount), 50, 135);

  // Notes if any
  if (payment.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Observations : ${payment.notes}`, 12, 149);
  }

  // Signatures Section
  const sigY = 156;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, sigY, 58, 38, 2, 2, 'FD');
  doc.roundedRect(78, sigY, 58, 38, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Le Représentant du Conseil', 41, sigY + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(residence.councilVP, 41, sigY + 11, { align: 'center' });
  doc.text('(Visa / Émargement)', 41, sigY + 32, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.text('Pour le Syndic de Gestion', 107, sigY + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${residence.syndicPro}`, 107, sigY + 11, { align: 'center' });
  doc.text(`${residence.syndicManager}`, 107, sigY + 15, { align: 'center' });
  doc.text('[Cachet & Signature électronique]', 107, sigY + 32, { align: 'center' });

  // Stamp simulation
  doc.setDrawColor(37, 99, 235);
  doc.setTextColor(37, 99, 235);
  doc.roundedRect(88, sigY + 18, 38, 10, 1, 1, 'S');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('COPRO SYNC H T - VALIDÉ', 107, sigY + 24, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Document certifié conforme émis par la plateforme numérique de gestion Résidence Adam 168', 74, 199, { align: 'center' });

  doc.save(`Quittance_${apartment.number.replace(' ', '_')}_${getMonthName(payment.month)}_${payment.year}.pdf`);
};

export const generateMonthlyReportPDF = (
  month: number,
  year: number,
  residence: CoProprieteState,
  budgetItems: BudgetItem[],
  expenses: Expense[],
  payments: PaymentRecord[],
  apartments: Apartment[],
  tasks: AGTask[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const monthName = getMonthName(month);

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy 900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(residence.name.toUpperCase(), 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${residence.address} - ${residence.city} | Exercice ${residence.fiscalYear}`, 14, 21);
  doc.text(`Syndic Pro : ${residence.syndicPro} (${residence.syndicManager}) | Représentant : ${residence.councilVP}`, 14, 27);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 211, 153); // Emerald accent
  doc.text(`RAPPORT DE GESTION & TRANSPARENCE - ${monthName.toUpperCase()} ${year}`, 196, 18, { align: 'right' });

  // Calculations for report
  const taxableApts = apartments.filter(a => a.monthlyDue > 0);
  const paidThisMonth = taxableApts.filter(a =>
    payments.some(p => p.apartmentId === a.id && p.year === year && p.month === month)
  );
  const recoveryRate = Math.round((paidThisMonth.length / taxableApts.length) * 100);

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const ordExpenses = monthExpenses.filter(e => e.type === 'ORDINAIRE').reduce((s, e) => s + Number(e.amount), 0);
  const specExpenses = monthExpenses.filter(e => e.type === 'EXCEPTIONNEL_RESERVE').reduce((s, e) => s + Number(e.amount), 0);
  const totalCotisationsMonth = paidThisMonth.length * residence.monthlyDuePerApt;

  // 1. Executive Summary Cards (Row of 4 cards)
  const cardY = 38;
  const cardWidth = 43;
  const cardHeight = 22;
  const gap = 3;

  // Card 1: Encaissements Cotisations
  doc.setFillColor(240, 253, 244); // Green 50
  doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text('Cotisations Perçues', 17, cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrency(totalCotisationsMonth)}`, 17, cardY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${paidThisMonth.length} / ${taxableApts.length} copropriétaires`, 17, cardY + 19);

  // Card 2: Dépenses Ordinaires
  doc.setFillColor(254, 242, 242); // Red 50
  doc.roundedRect(14 + (cardWidth + gap), cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(153, 27, 27);
  doc.text('Dépenses Ordinaires', 17 + (cardWidth + gap), cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrency(ordExpenses)}`, 17 + (cardWidth + gap), cardY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prévu : ${formatCurrency(6000)}/mois`, 17 + (cardWidth + gap), cardY + 19);

  // Card 3: Travaux AG & Réserve
  doc.setFillColor(254, 243, 199); // Amber 50
  doc.roundedRect(14 + (cardWidth + gap) * 2, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('Travaux & Réserve', 17 + (cardWidth + gap) * 2, cardY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${formatCurrency(specExpenses)}`, 17 + (cardWidth + gap) * 2, cardY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Fonds exceptionnels AG', 17 + (cardWidth + gap) * 2, cardY + 19);

  // Card 4: Taux de Recouvrement
  doc.setFillColor(238, 242, 255); // Indigo 50
  doc.roundedRect(14 + (cardWidth + gap) * 3, cardY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 48, 163);
  doc.text('Taux de Recouvrement', 17 + (cardWidth + gap) * 3, cardY + 6);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${recoveryRate} %`, 17 + (cardWidth + gap) * 3, cardY + 14);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${taxableApts.length - paidThisMonth.length} impayé(s) ce mois`, 17 + (cardWidth + gap) * 3, cardY + 19);

  // 2. Budget vs Réalisé Table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. SUIVI DU BUDGET PRÉVISIONNEL ET DÉPENSES RÉELLES', 14, 68);

  const budgetTableData = budgetItems.map(item => {
    const spent = monthExpenses
      .filter(e => e.budgetId === item.id)
      .reduce((acc, e) => acc + Number(e.amount), 0);
    const variance = item.monthlyBudget - spent;
    return [
      item.code,
      item.name,
      formatCurrency(item.monthlyBudget),
      formatCurrency(spent),
      formatCurrency(variance),
      variance >= 0 ? 'Conforme' : 'Dépassement'
    ];
  });

  autoTable(doc, {
    startY: 72,
    head: [['Code', 'Poste Budgétaire', 'Budget Prévu', 'Réalisé', 'Écart (DH)', 'Statut']],
    body: budgetTableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'center' }
    },
    styles: { cellPadding: 1.8 }
  });

  // 3. Suivi des Décisions AG
  let finalY = (doc as any).lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. AVANCEMENT DES DÉCISIONS ET TRAVAUX AG (12/08/2026)', 14, finalY);

  const tasksData = tasks.map(t => [
    t.title,
    t.status === 'TERMINE' ? 'Terminé' : t.status === 'EN_COURS' ? 'En cours' : 'Non commencé',
    t.provider,
    formatCurrency(t.estimatedBudget),
    t.finalInvoice > 0 ? formatCurrency(t.finalInvoice) : '-',
    t.deadline
  ]);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Action / Projet Voté', 'Statut', 'Prestataire', 'Devis (DH)', 'Facture (DH)', 'Échéance']],
    body: tasksData,
    theme: 'striped',
    headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 45 },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 20, halign: 'center' }
    },
    styles: { cellPadding: 1.5 }
  });

  // Footer & Signatures
  const footerY = 265;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, 196, footerY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Pour la commission de contrôle & Conseil syndical', 20, footerY + 6);
  doc.text('Pour la société de gestion COPRO SYNC H T', 130, footerY + 6);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`M. ${residence.councilVP} (Vice-Président)`, 20, footerY + 11);
  doc.text(`M. ${residence.syndicManager} (Directeur)`, 130, footerY + 11);
  doc.text('Document officiel certifié pour communication aux copropriétaires', 105, 288, { align: 'center' });

  doc.save(`Rapport_Gestion_${residence.name.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`);
};
