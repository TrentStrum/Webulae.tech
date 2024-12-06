export function SubscriptionDashboard({ userId }: { userId: string }) {
  return (
    <div>
      <h2>Current Subscription</h2>
      <div>Projects Usage</div>
      <div>Storage Usage</div>
      <div>API Calls Usage</div>
      <button>Cancel Auto-renew</button>
      <button>Update Plan</button>
      <div>Payment Methods</div>
      <button>Add Payment Method</button>
    </div>
  );
}