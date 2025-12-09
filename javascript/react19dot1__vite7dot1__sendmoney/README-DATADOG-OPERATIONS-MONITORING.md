# Datadog Operations Monitoring

## Datadog Operations Monitoring

This app implements **Datadog Operations Monitoring** to track complete user journeys from start to finish.

### What We Track

**1. Send Money Transaction Operation**
- Tracks the entire flow from landing page to transaction result
- Operation Name: `send-money-transaction`
- Operation Key: `send-money-transaction-main`
- Measures: Duration, success rate, failure rate

**2. Scam Alert Decision Operation (Nested)**
- Tracks user decisions when scam alert appears
- Operation Name: `scam-alert-decision`
- Operation Key: `send-money-transaction-main:scam-alert`
- Parent: Links to main transaction operation

### Key Features

- **End-to-end tracking**: Full visibility from page load to final result
- **Nested operations**: Track sub-workflows within main operations
- **Multiple outcomes**: Success, failure (error), and abandonment
- **Rich context**: Phone numbers, amounts, transaction IDs, timestamps

### Operation Flows

**Normal Transaction Flow:**
1. User lands on page → Operation starts
2. User submits form → API call
3. Result page displayed → Operation stops (success or failure)

**Scam Alert Flow:**
1. User lands on page → Operation starts
2. User enters blacklisted number → Nested operation starts (modal shows)
3. User clicks "Reject" → Nested operation succeeds, main operation abandoned
4. OR User clicks "Accept" → Nested operation succeeds, transaction continues

### Documentation

For complete implementation details, flow diagrams, testing guide, and Datadog verification steps, see:

📖 **[README-DATADOG-OPERATIONS-MONITORING.md](./README-DATADOG-OPERATIONS-MONITORING.md)**

### Resources

- [Datadog Operations Monitoring Docs](https://docs.datadoghq.com/real_user_monitoring/operations_monitoring/?tab=browser)
- Research: `2-RESEARCH.md`
- Implementation Plan: `3-PLAN.md`


## Overview

This app uses **Datadog Operations Monitoring** to track complete user journeys from start to finish, measuring duration, success/failure rates, and collecting context data.

### Operations Tracked

| Operation | Name | Key | Type |
|-----------|------|-----|------|
| Transaction | `send-money-transaction` | `send-money-transaction-main` | Parent |
| Scam Alert | `scam-alert-decision` | `send-money-transaction-main:scam-alert` | Nested |

---

## What is Operations Monitoring?

**Operations Monitoring** tracks business workflows end-to-end, unlike Custom Actions which track single events.

| Feature | Custom Actions | Operations |
|---------|---------------|------------|
| Scope | Single event | Complete workflow |
| Duration | Point in time | Start to finish |
| Lifecycle | One call | Start + Stop |

---

## Operation Flows

### Flow 1: Normal Transaction (Success/Failure)

```
1. Landing Page Loads
   └─► START: send-money-transaction

2. User Enters Details & Submits

3. API Call → Result
   └─► STOP: send-money-transaction
       ├─ Success (status 200) → succeedFeatureOperation()
       └─ Failure (status ≠ 200) → failFeatureOperation('error')
```

### Flow 2: Scam Alert - User Rejects

```
1. Landing Page Loads
   └─► START: send-money-transaction (parent)

2. Blacklisted Number Detected (88888888)
   └─► START: scam-alert-decision (nested)
       ├─ Key: 'send-money-transaction-main:scam-alert'
       └─ Context: parentOperationKey = 'send-money-transaction-main'

3. User Clicks "Reject"
   ├─► STOP: scam-alert-decision → succeedFeatureOperation()
   └─► STOP: send-money-transaction → failFeatureOperation('abandoned')
```

### Flow 3: Scam Alert - User Accepts

```
1. Landing Page Loads
   └─► START: send-money-transaction (parent)

2. Blacklisted Number Detected
   └─► START: scam-alert-decision (nested)

3. User Clicks "Accept"
   └─► STOP: scam-alert-decision → succeedFeatureOperation()

4. Transaction Continues → API Call
   └─► STOP: send-money-transaction
       ├─ Success → succeedFeatureOperation()
       └─ Failure → failFeatureOperation('error')
```

---

## Implementation

### 1. Enable Feature Flag

**File:** `src/datadog-rum.js`

```javascript
datadogRum.init({
  // ... existing config
  enableExperimentalFeatures: ['feature_operation_vital'], // Required!
})
```

### 2. Start Main Operation

**File:** `src/components/SendMoneyForm.jsx`

```javascript
useEffect(() => {
  datadogRum.startFeatureOperation('send-money-transaction', {
    operationKey: 'send-money-transaction-main',
    context: { startTime: new Date().toISOString(), page: 'landing' },
    description: 'User journey from landing page to transaction result'
  })
}, [])
```

### 3. Stop Main Operation

**File:** `src/App.jsx`

```javascript
// Success
datadogRum.succeedFeatureOperation('send-money-transaction', {
  operationKey: 'send-money-transaction-main',
  context: { transactionId, amount, phone, endTime }
})

// Failure
datadogRum.failFeatureOperation('send-money-transaction', 'error', {
  operationKey: 'send-money-transaction-main',
  context: { transactionId, errorMessage, amount, phone, endTime }
})
```

### 4. Nested Operation (Scam Alert)

**File:** `src/components/SendMoneyForm.jsx`

**Start:**
```javascript
if (isBlacklisted(formData.phone)) {
  datadogRum.startFeatureOperation('scam-alert-decision', {
    operationKey: 'send-money-transaction-main:scam-alert',
    context: {
      parentOperationKey: 'send-money-transaction-main', // Links to parent
      phoneNumber, amount, startTime
    }
  })
}
```

**Stop (Reject):**
```javascript
// Nested succeeds (decision made)
datadogRum.succeedFeatureOperation('scam-alert-decision', {
  operationKey: 'send-money-transaction-main:scam-alert',
  context: { parentOperationKey: 'send-money-transaction-main', decision: 'rejected' }
})

// Parent abandoned
datadogRum.failFeatureOperation('send-money-transaction', 'abandoned', {
  operationKey: 'send-money-transaction-main',
  context: { reason: 'user-rejected-scam-alert' }
})
```

**Stop (Accept):**
```javascript
// Nested succeeds, parent continues
datadogRum.succeedFeatureOperation('scam-alert-decision', {
  operationKey: 'send-money-transaction-main:scam-alert',
  context: { parentOperationKey: 'send-money-transaction-main', decision: 'accepted' }
})
```

---

## Testing

Run: `npm run dev` → Open http://localhost:5173

### Test Scenarios

| Test | Input | Action | Expected Operations |
|------|-------|--------|-------------------|
| 1. Success | Phone: 12345678<br>Amount: 100 | Submit | `send-money-transaction`: Success |
| 2. Failure | Phone: 12345678<br>Amount: 100 | Submit (retry until fail) | `send-money-transaction`: Failed (error) |
| 3. Reject | Phone: 88888888<br>Amount: 100 | Click "Reject" | `scam-alert-decision`: Success<br>`send-money-transaction`: Failed (abandoned) |
| 4. Accept→Success | Phone: 88888888<br>Amount: 100 | Click "Accept" (retry until success) | Both: Success |
| 5. Accept→Failure | Phone: 88888888<br>Amount: 100 | Click "Accept" (retry until fail) | `scam-alert-decision`: Success<br>`send-money-transaction`: Failed (error) |

### Console Logs

Check browser console for:
```
Started operation: send-money-transaction
Started nested operation: scam-alert-decision
Nested operation succeeded: scam-alert-decision (rejected/accepted)
Operation succeeded/failed: send-money-transaction
```

---

## Datadog Verification

### Access Operations
1. Log into Datadog → RUM
2. Navigate to Operations or RUM Explorer
3. Filter: `service:jek-sendmoney-app`, `env:test`

### What to Verify

**Operation Names:**
- `send-money-transaction`
- `scam-alert-decision`

**Operation Keys:**
- `send-money-transaction-main`
- `send-money-transaction-main:scam-alert`

**Testing Two Approaches:**

1. **Hierarchical Naming (in operationKey):**
   - Key: `send-money-transaction-main:scam-alert`
   - Test: Can you filter by pattern `*:scam-alert`?

2. **Parent Reference (in context):**
   - Context field: `parentOperationKey: 'send-money-transaction-main'`
   - Test: Can you query `@context.parentOperationKey:"send-money-transaction-main"`?

### Metrics to Check
- Count: Number of operations
- Duration: Time from start to stop
- Success Rate: % of successful operations
- Failure Breakdown: Error vs Abandoned

---

## Key Concepts

### Static vs Dynamic Keys

**Current (Static - for testing):**
```javascript
operationKey: 'send-money-transaction-main'
```
- Easy to find in Datadog
- Cannot track concurrent operations
- Test one transaction at a time

**Production (Dynamic):**
```javascript
operationKey: `txn-${Date.now()}-${randomId}`
```
- Tracks concurrent operations
- Each instance is unique

### Failure Reasons

- `'error'` - API/system error
- `'abandoned'` - User cancelled
- `'timeout'` - Operation timed out
- `'other'` - Other reasons

### Nested Operations

Datadog doesn't have built-in parent-child support. We test two approaches:

1. **Hierarchical naming:** `parent:child` (in key itself)
2. **Parent reference:** Store `parentOperationKey` in context

Both are implemented simultaneously to compare effectiveness in Datadog UI.

---

## Files Modified

- `src/datadog-rum.js` - Feature flag
- `src/components/SendMoneyForm.jsx` - Start/stop operations
- `src/App.jsx` - Stop main operation
- `README.md` - Link to this doc

---

## Resources

- [Datadog Operations Monitoring](https://docs.datadoghq.com/real_user_monitoring/operations_monitoring/?tab=browser)
- `2-RESEARCH.md` - Research & design decisions
- `3-PLAN.md` - Implementation plan
