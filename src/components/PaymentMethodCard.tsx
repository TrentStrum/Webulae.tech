interface PaymentMethod {
  id: string;
  isDefault: boolean;
  // Add other payment method fields
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isDefault: boolean;
  onDelete: (id: string) => void;
}

export function PaymentMethodCard({ method, isDefault, onDelete }: PaymentMethodCardProps) {
  return (
    <div className="payment-method-card">
      <div>Payment Method {method.id}</div>
      {isDefault && <div>Default</div>}
      <button onClick={() => onDelete(method.id)}>Delete</button>
    </div>
  );
} 