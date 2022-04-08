import info from '../info.png'

function About(){
  return(
    <div>
        <div className="flex justify-center">
        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
            <img src={info} width="100" height="100" alt="My Sticker" />
            <p>我是工科海洋所，林子傑，我喜歡寫程式</p>
        </div>
        </div>
    </div>
  )
}

export default About;