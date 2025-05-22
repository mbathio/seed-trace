
import { MOCK_PRODUCTIONS, MOCK_QUALITY_CONTROLS, MOCK_SEED_LOTS, MOCK_VARIETIES } from '@/utils/seedTypes';

// Helper functions for preparing data

// Prepare data for the production report
export const productionData = () => {
  // Group production data by variety
  const varietyProductions = MOCK_SEED_LOTS.reduce<Record<string, number>>((acc, lot) => {
    const variety = MOCK_VARIETIES.find(v => v.id === lot.varietyId);
    if (variety) {
      const name = variety.name;
      acc[name] = (acc[name] || 0) + lot.quantity;
    }
    return acc;
  }, {});
  
  // Convert to chart data format
  return Object.entries(varietyProductions).map(([name, quantity]) => ({
    name,
    quantity
  }));
};

// Prepare data for the quality report
export const qualityData = () => {
  // Calculate pass/fail rates by seed level
  const levelResults = MOCK_QUALITY_CONTROLS.reduce<Record<string, { pass: number, fail: number }>>((acc, control) => {
    const lot = MOCK_SEED_LOTS.find(l => l.id === control.lotId);
    if (lot) {
      const level = lot.level;
      if (!acc[level]) acc[level] = { pass: 0, fail: 0 };
      if (control.result === "pass") {
        acc[level].pass += 1;
      } else {
        acc[level].fail += 1;
      }
    }
    return acc;
  }, {});
  
  // Convert to chart data format for pass rate
  return Object.entries(levelResults).map(([level, results]) => {
    const total = results.pass + results.fail;
    const passRate = total > 0 ? (results.pass / total) * 100 : 0;
    
    return {
      name: level,
      passRate,
      failRate: 100 - passRate,
      passCount: results.pass,
      failCount: results.fail
    };
  }).sort((a, b) => {
    const levelOrder = { 'GO': 0, 'G1': 1, 'G2': 2, 'G3': 3, 'G4': 4, 'R1': 5, 'R2': 6 };
    return levelOrder[a.name as keyof typeof levelOrder] - levelOrder[b.name as keyof typeof levelOrder];
  });
};

// Prepare data for the yield report
export const yieldData = () => {
  const completedProductions = MOCK_PRODUCTIONS.filter(p => p.status === 'completed' && p.yield !== undefined);
  
  // Group by lot level
  const yieldByLevel: Record<string, { total: number, count: number }> = {};
  
  completedProductions.forEach(production => {
    const lot = MOCK_SEED_LOTS.find(l => l.id === production.lotId);
    if (lot && production.yield) {
      const level = lot.level;
      if (!yieldByLevel[level]) {
        yieldByLevel[level] = { total: 0, count: 0 };
      }
      yieldByLevel[level].total += production.yield;
      yieldByLevel[level].count += 1;
    }
  });
  
  // Calculate averages
  return Object.entries(yieldByLevel).map(([level, data]) => ({
    name: level,
    averageYield: data.count > 0 ? data.total / data.count : 0,
    productionCount: data.count
  })).sort((a, b) => {
    const levelOrder = { 'GO': 0, 'G1': 1, 'G2': 2, 'G3': 3, 'G4': 4, 'R1': 5, 'R2': 6 };
    return levelOrder[a.name as keyof typeof levelOrder] - levelOrder[b.name as keyof typeof levelOrder];
  });
};
