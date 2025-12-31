import { useEffect } from 'react'

function ResultPage({ status, transactionId, onReturnHome }) {
  const isSuccess = status === 200

  // Custom Vital: Stop measuring transaction duration when result page renders
  useEffect(() => {
    window.DD_RUM.stopDurationVital('jekCustomVitalSendMoneyTransaction', {
      context: {
        status: status,
        transactionId: transactionId,
        isSuccess: isSuccess,
        endTime: new Date().toISOString()
      }
    })
    console.log('Custom Vital Stopped: jekCustomVitalSendMoneyTransaction', {
      status,
      transactionId
    })
  }, [status, transactionId, isSuccess])

  return (
    <div className={`result-page ${isSuccess ? 'success' : 'failure'}`}>
      <div className="result-container">
        <div className="result-icon">
          {isSuccess ? '✓' : '✗'}
        </div>

        <h2 className="result-title">
          {isSuccess ? 'Success!' : 'Failed'}
        </h2>

        <p className="result-message">
          {isSuccess
            ? 'Your money has been sent successfully'
            : 'Transaction could not be processed'
          }
        </p>

        <div className="transaction-info">
          <div className="transaction-id">
            <span className="label">Transaction ID:</span>
            <span className="value">{transactionId}</span>
          </div>
        </div>

        <button
          onClick={onReturnHome}
          className="return-button"
          type="button"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default ResultPage