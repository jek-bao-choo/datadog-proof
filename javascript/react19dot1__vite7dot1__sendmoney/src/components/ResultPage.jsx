function ResultPage({ status, transactionId, message, onReturnHome }) {
  const isSuccess = status === 200

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