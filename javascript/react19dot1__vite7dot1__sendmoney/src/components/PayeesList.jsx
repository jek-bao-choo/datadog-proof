// PayeesList Component
// Displays list of saved payees and button to add new payee
function PayeesList({ payees, onAddPayee, onSelectPayee, onDeletePayee }) {
  return (
    <div className="payees-section">
      <div className="payees-header">
        <h2>Payees</h2>
        <button
          type="button"
          onClick={onAddPayee}
          className="add-payee-button"
        >
          + Add Payee
        </button>
      </div>

      {payees.length === 0 ? (
        <div className="empty-payees">
          <p>You haven't added any payees yet</p>
        </div>
      ) : (
        <div className="payees-list">
          {payees.map((payee) => (
            <div
              key={payee.id}
              className="payee-item"
              onClick={() => onSelectPayee(payee)}
            >
              <div className="payee-info">
                <div className="payee-name">{payee.name}</div>
                <div className="payee-mobile">{payee.mobileNumber}</div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering onSelectPayee
                  onDeletePayee(payee.id)
                }}
                className="delete-payee-button"
                aria-label="Delete payee"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PayeesList
