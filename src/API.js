const SessionList = {};

import HostSession from "./Host.js"

async function HostConnection(socket) {
  let ID = null
  socket.on('message', (Type, Data)=>{
    console.log(ID, Type, Data)
    if (Type == 'new') {
      if (ID)
        return;
      let LoopCount = 0
      while (LoopCount++ < 1000 && (!ID || SessionList[ID])) {
        ID = Math.floor(Math.random() * 100000)
        ID = ID.toString().padStart(5, '0')
      }
      SessionList[ID] = new HostSession(ID, socket)
    }
    if (Type == 'resume') {
      if (!ID && !SessionList[Data])
      {
        ID = Data
        SessionList[ID] = new HostSession(ID, socket)
      }
    }
  });
  socket.on('disconnect', ()=>{
    if (ID) {
      SessionList[ID].Close()
      delete SessionList[ID]
    }
  })
}

async function JoinConnection(socket) {
  socket.on('message', (Type, Data)=>{
    if (Type == 'join') {
      const HostID = Data
      if (!SessionList[HostID])
        socket.send('Error', "Code not recognised")
      else
        SessionList[HostID].ClientConnection(socket)
    }
  });
}
export function AttachAPI(Server) {
  Server.IO.of('/host').on('connect', HostConnection)
  Server.IO.of('/join').on('connect', JoinConnection)
}