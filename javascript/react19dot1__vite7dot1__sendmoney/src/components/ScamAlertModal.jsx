// ScamAlertModal Component
// This modal displays a warning when user tries to send money to a blacklisted number
function ScamAlertModal({ phoneNumber, onAccept, onReject }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Warning Icon */}
        <div className="modal-icon warning-icon">
          ⚠️
        </div>

        {/* Title */}
        <h2 className="modal-title">Warning: Scam Alert</h2>

        {/* Description */}
        <p className="modal-description">
          Please accept the risk that this number {phoneNumber} is a blacklisted scam number - transferring money to this number at your own risk.
        </p>

        {/* Action Buttons */}
        <div className="modal-buttons">
          <button
            type="button"
            onClick={onReject}
            className="modal-button reject-button"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="modal-button accept-button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScamAlertModal
