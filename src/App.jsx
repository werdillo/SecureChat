import { useState, useEffect, useRef } from 'react';
import './App.css'

function Modal({ onClose, onSelectImage }) {
  const images = [
    "dog.jpg",
    "doc.jpg",
    "grass.jpg",
  ];
  const specialImage = "blur_doc.jpg"; 
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSpecialOptions, setShowSpecialOptions] = useState(false); 

  const initiateSendImage = () => {
    if (selectedImage) {
      setLoading(true); 
      setTimeout(() => {
        if (selectedImage === images[1]) {
          setLoading(false); 
          setShowSpecialOptions(true); 
        } else {
          sendImage();
        }
      }, 1000);
    }
  }

  const sendImage = () => {
    onSelectImage(selectedImage);
    resetModal();
  }

  const handleSendSpecialImage = () => {
    onSelectImage(specialImage);
    resetModal();
  }

  const resetModal = () => {
    setSelectedImage(null);
    setLoading(false);
    setShowSpecialOptions(false);
    onClose();
  }

  return (
    <div className='modal' onClick={e => e.target.className === 'modal' && resetModal()}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        {/* <span className='close' onClick={resetModal}>&times;</span> */}
        { !showSpecialOptions && (
          <>
          <div className="-image-selection">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Choice ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className={image === selectedImage ? '-img selected' : '-img'}
              />
            ))}
          </div>
            {loading ? <div style={{ margin: '10px', textAlign: 'center' }}>
              <div className="loader"></div>
            </div> :
            <button disabled={!selectedImage} onClick={initiateSendImage} style={{ margin: '10px' }}>Send</button>
            }
          </>
        )}
        
        {showSpecialOptions && (
          <>
            <div className='-title b'>
              Uzmanību!
            </div>
            <div className='-title'>
              Izskatās, ka jums ir objekta attēls, kas varētu pārkāpt privātumu.
            </div>
            <div className='-buttons'>
              <button className='-item danger' onClick={sendImage}>Sūtīt</button>
              <button className='-item middle' onClick={handleSendSpecialImage}>Blur attēlu</button>
              <button className='-item' onClick={resetModal}>Nesūtīt</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = (message) => {
    if (message && message.trim() !== "") {
      setMessages(prev => [...prev, message]);
      setInputMessage("");
    }
  }

  const handleSelectImage = (image) => {
    sendMessage(image);
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className='main'>
        <div className='-header'>
          <img className='-img' src='https://static.photocdn.pt/images/articles/2019/09/22/Screen_Shot_2019-09-22_at_10.50.07_AM.webp' />
          Ieva
        </div>
        <div className='-chat' ref={chatRef}> 
          {messages.map((msg, index) => (
            <div key={index} className='-msg-container'>
              {msg.endsWith('.jpg') ? <img src={msg} className='-img' alt="Chat Image" style={{ maxWidth: '200px' }} /> : <div className='-message'>{msg}</div>}
            </div>
          ))}
        </div>
        <div className='-footer'>
          <img src='/photo.svg' className='-icon' onClick={() => setShowModal(true)} />

          <input
            className='-input'
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(inputMessage)}
          />
          <img src='/send.svg' className='-icon' onClick={() => sendMessage(inputMessage)} />
        </div>
      </div>
      {showModal && <Modal onClose={() => setShowModal(false)} onSelectImage={handleSelectImage} />}
    </>
  );
}


