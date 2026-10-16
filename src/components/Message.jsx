export default function Message({ message, type = 'success' }) {
  if (!message) return null
  return <div className={`message ${type}`}>{message}</div>
}
