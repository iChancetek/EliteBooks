// Pseudo-random generator for stable mock data
const mulberry32 = (a: number) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Generate Expenses
export const generateMockExpenses = () => {
  const expenses = [];
  let id = 1;
  const categories = ['Office & Supplies', 'Software & SaaS', 'Meals & Entertainment', 'Travel & Transport', 'Rent & Utilities', 'Marketing', 'Professional Services', 'Insurance', 'Training & Education', 'Bank Fees & Interest', 'Subscriptions', 'Miscellaneous'];
  const vendors = ['Amazon', 'Adobe', 'Uber', 'Delta Airlines', 'WeWork', 'Facebook Ads', 'LegalZoom', 'Geico', 'Coursera', 'Chase Bank', 'Slack', 'Office Depot'];
  
  for (let year = 2016; year <= 2026; year++) {
    const prng = mulberry32(year);
    // Exponential growth trend from 2016 to 2026
    const trendMultiplier = Math.pow(1.15, year - 2016);
    
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month > 5) continue; // Stop at May 2026

      const numExpenses = Math.floor(prng() * 10) + 15; // 15 to 25 expenses per month
      for (let i = 0; i < numExpenses; i++) {
        const catIdx = Math.floor(prng() * categories.length);
        const day = Math.floor(prng() * 28) + 1;
        const baseAmount = (prng() * 1000 + 50) * trendMultiplier;
        const isWk1 = day <= 7;
        const isWk2 = day > 7 && day <= 14;
        const isWk3 = day > 14 && day <= 21;
        const isWk4 = day > 21;
        
        expenses.push({
          id: `exp-${id++}`,
          date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          weekId: isWk1 ? 'Wk 1' : isWk2 ? 'Wk 2' : isWk3 ? 'Wk 3' : 'Wk 4',
          monthId: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
          yearId: year.toString(),
          vendor: vendors[catIdx],
          amount: Math.round(baseAmount * 100) / 100,
          category: categories[catIdx],
          aiCategorized: prng() > 0.1,
          confidence: Math.round((prng() * 0.2 + 0.8) * 100) / 100,
          status: prng() > 0.9 ? 'pending' : 'approved',
          description: `Expense for ${categories[catIdx]}`,
          recurrance: prng() > 0.8 ? 'Monthly' : 'None'
        });
      }
    }
  }
  return expenses;
};

// Generate Invoices
export const generateMockInvoices = () => {
  const invoices = [];
  let id = 1;
  const clients = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Stark Ind.', 'Wayne Ent.'];
  const statuses = ['paid', 'paid', 'paid', 'paid', 'sent', 'viewed', 'overdue'];

  for (let year = 2016; year <= 2026; year++) {
    const prng = mulberry32(year + 1000);
    const trendMultiplier = Math.pow(1.15, year - 2016);
    
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month > 5) continue;
      
      const numInvoices = Math.floor(prng() * 8) + 5; 
      for (let i = 0; i < numInvoices; i++) {
        const day = Math.floor(prng() * 28) + 1;
        const baseAmount = (prng() * 5000 + 1000) * trendMultiplier;
        const status = statuses[Math.floor(prng() * statuses.length)];
        
        const isWk1 = day <= 7;
        const isWk2 = day > 7 && day <= 14;
        const isWk3 = day > 14 && day <= 21;
        const isWk4 = day > 21;

        invoices.push({
          id: `inv-${id++}`,
          number: `INV-${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          clientName: clients[Math.floor(prng() * clients.length)],
          date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          dueDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
          weekId: isWk1 ? 'Wk 1' : isWk2 ? 'Wk 2' : isWk3 ? 'Wk 3' : 'Wk 4',
          monthId: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1],
          yearId: year.toString(),
          total: Math.round(baseAmount * 100) / 100,
          amountDue: status === 'paid' ? 0 : Math.round(baseAmount * 100) / 100,
          amountPaid: status === 'paid' ? Math.round(baseAmount * 100) / 100 : 0,
          status: status
        });
      }
    }
  }
  return invoices;
};

// Generate Payroll (we'll just use a stable employee list but adjust salary by trend)
export const generateMockPayroll = () => {
  const baseEmployees = [
    { id: '1', name: 'Sarah Johnson', role: 'Software Engineer', type: 'Full-time', baseSalary: 95000, department: 'Engineering', startYear: 2018 },
    { id: '2', name: 'Mike Chen', role: 'Product Designer', type: 'Full-time', baseSalary: 85000, department: 'Design', startYear: 2016 },
    { id: '3', name: 'Emily Davis', role: 'Marketing Manager', type: 'Full-time', baseSalary: 78000, department: 'Marketing', startYear: 2019 },
    { id: '4', name: 'James Wilson', role: 'Sales Rep', type: 'Full-time', baseSalary: 65000, department: 'Sales', startYear: 2020 },
    { id: '5', name: 'Alex Rivera', role: 'DevOps Engineer', type: 'Contractor', baseSalary: 72000, department: 'Engineering', startYear: 2021 },
    { id: '6', name: 'Lisa Park', role: 'Accountant', type: 'Part-time', baseSalary: 48000, department: 'Finance', startYear: 2017 },
  ];
  return baseEmployees;
};

// Global singletons so we don't regenerate on every render
export const ALL_EXPENSES = generateMockExpenses();
export const ALL_INVOICES = generateMockInvoices();
export const BASE_EMPLOYEES = generateMockPayroll();

// Restriction logic
const MOCK_USER = 'chancellor@ichancetek.com';

export const isMockUser = (email: string | null | undefined) => email === MOCK_USER;

export const getMockExpenses = (email: string | null | undefined) => isMockUser(email) ? ALL_EXPENSES : [];
export const getMockInvoices = (email: string | null | undefined) => isMockUser(email) ? ALL_INVOICES : [];
export const getMockEmployees = (email: string | null | undefined) => isMockUser(email) ? BASE_EMPLOYEES : [];

// Date Filter Utility
export const filterByDate = (items: any[], year: string, month: string) => {
  return items.filter(item => {
    const matchYear = year === 'All Years' || item.yearId === year;
    const matchMonth = month === 'All Months' || item.monthId === month || item.weekId === month; // weekId handles "Wk 1"
    return matchYear && matchMonth;
  });
};
