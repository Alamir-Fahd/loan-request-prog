const { getCached, setCached } = require('./redis');
const { evaluate } = require('./ruleEngine');

async function verifyIdentity(applicantId) {
  console.log(`[ACTIVITY] Verifying identity for: ${applicantId}`);
  
 
  await new Promise(resolve => setTimeout(resolve, 200));

  
  if (Math.random() < 0.1) {
    throw new Error('Identity check failed');
  }

  return { verified: true, applicantId };
}


async function fetchCreditScore(applicantId) {
  const cacheKey = `credit:${applicantId}`;
  
  
  const cachedScore = await getCached(cacheKey);
  
  if (cachedScore) {
    console.log(`[CACHE HIT] Found score for ${applicantId}: ${cachedScore}`);
    return cachedScore;
  }

  
  console.log(`[CACHE MISS] Generating new score for ${applicantId}`);
  const score = Math.floor(Math.random() * (850 - 600 + 1)) + 600;

  
  await setCached(cacheKey, score, 60);
  
  return score;
}

async function evaluateRules(facts) {
  console.log(`[ACTIVITY] Evaluating rules for score: ${facts.creditScore}`);
  return await evaluate(facts);
}

async function recordDecision(applicationId, decision) {
  const result = {
    applicationId,
    decision,
    timestamp: new Date().toISOString()
  };
  
  console.log(`[DECISION] applicationId=${result.applicationId} decision=${result.decision} timestamp=${result.timestamp}`);
  return result;
}

module.exports = {
  verifyIdentity,
  fetchCreditScore,
  evaluateRules,
  recordDecision
};
