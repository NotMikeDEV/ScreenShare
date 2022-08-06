export default class HostSession {
  constructor(ID, socket) {
    this.Clients = {}
    this.ID = ID
    this.Socket = socket
    this.Socket.send('ID', this.ID)
    console.log("New session", ID)
    socket.on('message', this.OnMessage.bind(this))
  }
  Close() {
    
  }
  OnMessage(Type, Data) {
    if (Type == 'Answer') {
      this.Clients[Data.ID].send("Answer", Data.Answer)
    }
    if (Type == 'ICE') {
      this.Clients[Data.ID].send("ICE", Data.Candidate)
    }
  }
  ClientConnection(socket) {
    socket.send('Connect', socket.id)
    this.Clients[socket.id] = socket
    this.Socket.send('Session', {
      ID: socket.id
    })
    socket.on('message', (Type, Data)=>{
      console.log(socket.id, Type, Data)
      if (Type == 'Call') {
        this.Socket.send('Call', {ID: socket.id, Call: Data})
      }
      if (Type == 'ICE') {
        this.Socket.send('ICE', {ID: socket.id, Candidate: Data})
      }
    })
  }
}