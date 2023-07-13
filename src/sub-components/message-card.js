export default function Message({data, isGroup, isMine}){
    const createdDateString = data.createdAt 
    const dateObj = new Date(createdDateString)
    const options = {
        hour: 'numeric',
        minute: 'numeric',
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', options).split(' ')[0]
    return(
        <div className={isMine ? "message-div-wrapper mine" : "message-div-wrapper"}>
            <div className={isMine ? "message-div mine" : "message-div"}>
                <div className="message-div__left">
                    {isGroup ? <div className="name">{data.senderName}</div> : ""}
                    <div className="content">
                        <p>{data.content}</p>
                    </div>
                </div>
                <div className="message-div__right">
                    {formattedTime}
                </div>
            </div>
        </div>
    )
}