const { proxyActivities } = require('@temporalio/workflow');
const { 
  verifyIdentity, 
  fetchCreditScore 
} = proxyActivities({
  startToCloseTimeout: '30s',
});

const { 
  evaluateRules, 
  recordDecision 
} = proxyActivities({
  startToCloseTimeout: '10s',
});

async function screeningWorkflow(application) {
  const { applicantId, income, debtAmount } = application;
  await verifyIdentity(applicantId);
  const creditScore = await fetchCreditScore(applicantId);
  const decision = await evaluateRules({
    creditScore,
    income,
    debtAmount
  });

  await recordDecision(applicantId, decision);
  return decision;
}

module.exports = { screeningWorkflow };
