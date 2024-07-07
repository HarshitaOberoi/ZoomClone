const socket=io('/')

const videoGrid = document.getElementById("video-grid")

const myVideo = document.createElement('video')
myVideo.muted = true


var peer=new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'3030'
})

let myVideoStream = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

})
// This code requests access to the user's camera and microphone using the getUserMedia method. Once the user grants permission, it returns a Promise that resolves with a MediaStream object representing the user's camera and microphone. This stream is then assigned
//  to the myVideoStream variable, and the addVideoStream function is
//  called with myVideo and the obtained stream as arguments.
peer.on('call', (call)=> {
    call.answer(myVideoStream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
})

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


socket.on("user-connected",(userId)=>{
    connecToNewUser(userId,stream);
})
const connecToNewUser=(userId,stream)=>{
    const call=peer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

}
// This function, addVideoStream, takes a video element and a stream as
//  parameters. It sets the srcObject property of the video element to the provided stream. 
// It also adds an event listener for the 'loadedmetadata' event, which triggers when the metadata for the video is loaded. 
// When this event occurs, the video is played, and the video element is appended to the videoGrid element.
