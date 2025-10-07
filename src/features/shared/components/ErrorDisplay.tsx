interface ErrorDisplayProps {
  errors: Record<string, string[]> | string | null;
}

export function ErrorDisplay({ errors }: ErrorDisplayProps) {
  if (!errors) return null;

  return (
    <div className="error-container">
      {typeof errors === 'string' ? (
        <p className="error-message">{errors}</p>
      ) : (
        Object.entries(errors).map(([field, messages]) => (
          <div key={field} className="field-errors">
            {messages.map((message: string, index: number) => (
              <p key={`${field}-${index}`} className="error-message">
                {message}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}