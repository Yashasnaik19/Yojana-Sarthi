import { Scheme, UserProfile, MatchScoreResult } from '../types';

export function calculateSchemeMatch(scheme: Scheme, profile: UserProfile): MatchScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Occupation Match (up to 40 points)
  const userHasMatchingOccupation = profile.userTypes.some((uType) =>
    scheme.targetGroups.includes(uType)
  );

  if (userHasMatchingOccupation) {
    score += 40;
    const matchedTypes = profile.userTypes.filter((t) => scheme.targetGroups.includes(t));
    reasons.push(`Occupation matches scheme target group (${matchedTypes.join(', ')})`);
  } else if (scheme.targetGroups.includes('other')) {
    score += 20;
    reasons.push('Open to general citizens and informal workers');
  }

  // 2. Need Match (up to 30 points)
  let needPoints = 0;
  const matchedNeeds: string[] = [];

  const categoryLower = scheme.category.toLowerCase();
  const subCategoryLower = (scheme.subCategory || '').toLowerCase();
  const benefitType = scheme.benefitType;

  profile.needs.forEach((need) => {
    let matched = false;
    if (need === 'agriculture' && (categoryLower.includes('agri') || subCategoryLower.includes('agri') || scheme.id.includes('kisan') || scheme.id.includes('fasal') || scheme.id.includes('raitha'))) {
      matched = true;
    } else if (need === 'loan' && (benefitType === 'loan' || categoryLower.includes('credit') || subCategoryLower.includes('credit') || scheme.benefits.toLowerCase().includes('loan'))) {
      matched = true;
    } else if (need === 'financial' && (benefitType === 'financial' || benefitType === 'subsidy' || scheme.benefits.toLowerCase().includes('₹'))) {
      matched = true;
    } else if (need === 'skill' && (categoryLower.includes('skill') || subCategoryLower.includes('training') || benefitType === 'training')) {
      matched = true;
    } else if (need === 'employment' && (categoryLower.includes('employ') || subCategoryLower.includes('apprentice') || scheme.id.includes('naps') || scheme.id.includes('yuva'))) {
      matched = true;
    } else if (need === 'scholarship' && (categoryLower.includes('education') || benefitType === 'scholarship' || scheme.id.includes('nsp'))) {
      matched = true;
    } else if (need === 'business' && (categoryLower.includes('business') || scheme.id.includes('udyam') || scheme.id.includes('pmegp'))) {
      matched = true;
    } else if (need === 'tools' && (benefitType === 'tools' || scheme.benefits.toLowerCase().includes('tool') || scheme.id.includes('vishwakarma'))) {
      matched = true;
    } else if (need === 'insurance' && (benefitType === 'insurance' || categoryLower.includes('insurance') || scheme.id.includes('pmfby'))) {
      matched = true;
    }

    if (matched) {
      matchedNeeds.push(need);
      needPoints += 15;
    }
  });

  const cappedNeedPoints = Math.min(30, needPoints);
  score += cappedNeedPoints;
  if (matchedNeeds.length > 0) {
    reasons.push(`Directly satisfies your requested needs (${matchedNeeds.join(', ')})`);
  }

  // 3. State Match (up to 15 points)
  if (scheme.scope === 'CENTRAL') {
    score += 15;
    reasons.push('Central government scheme applicable across all Indian states');
  } else if (scheme.scope === 'STATE') {
    if (scheme.state.toLowerCase() === profile.state.toLowerCase()) {
      score += 15;
      reasons.push(`State-specific initiative applicable to residents of ${profile.state}`);
    } else {
      // Different state penalty
      score = Math.max(0, score - 30);
    }
  }

  // 4. Role-specific Criteria (up to 15 points)
  if (scheme.targetGroups.includes('farmer') && profile.farmerDetails) {
    if (scheme.id === 'pm-kisan' && profile.farmerDetails.landOwned) {
      score += 15;
      reasons.push('Cultivable land ownership reported in profile');
    } else if (scheme.id === 'pmfby') {
      score += 15;
      reasons.push('Crop cultivation reported in profile');
    } else if (scheme.id.includes('raitha') && profile.farmerDetails.landOwned) {
      score += 15;
      reasons.push('Karnataka farmer with land ownership reported');
    } else {
      score += 10;
    }
  } else if (scheme.targetGroups.includes('street_vendor') && profile.vendorDetails) {
    if (profile.vendorDetails.existingRegistration || profile.vendorDetails.municipality) {
      score += 15;
      reasons.push('Urban street vending activity recorded in profile');
    } else {
      score += 10;
    }
  } else if (scheme.targetGroups.includes('artisan') && profile.artisanDetails) {
    score += 15;
    reasons.push(`Traditional artisan craft profile reported (${profile.artisanDetails.tradeCraft || 'Craftsperson'})`);
  } else if (scheme.targetGroups.includes('student') && profile.studentDetails) {
    score += 15;
    reasons.push(`Enrolled student level reported (${profile.studentDetails.educationLevel || 'Enrolled'})`);
  } else if (scheme.targetGroups.includes('business') && profile.userTypes.includes('business')) {
    score += 15;
    reasons.push('Micro/small business activity recorded');
  } else if (scheme.targetGroups.includes('worker') && profile.workerDetails) {
    score += 15;
    reasons.push('Active worker/job-seeker profile');
  } else {
    // General citizen baseline
    score += 5;
  }

  // Final normalization (clamp between 15% and 98% to avoid claiming 100% official guarantee)
  const normalizedScore = Math.min(96, Math.max(20, score));

  return {
    scheme,
    score: normalizedScore,
    reasons: reasons.length > 0 ? reasons : ['General public welfare criteria match'],
    disclaimer: 'This match is an informational recommendation. Final eligibility is determined by the concerned government department.'
  };
}

export function rankSchemesForProfile(schemes: Scheme[], profile: UserProfile): MatchScoreResult[] {
  const scored = schemes.map((s) => calculateSchemeMatch(s, profile));
  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score);
}
