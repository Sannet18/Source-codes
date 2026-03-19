export default class Message {
  constructor({ id, userId, toId, message, redacted = false }) {
    this.id = id
    this.userId = userId
    this.toId = toId
    this.message = message
    this.redacted = redacted
  }
}
