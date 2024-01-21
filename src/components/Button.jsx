export default function Button(props) {
    let btnColor= props.btnColor;
    let flash= props.flash;
    console.log(props.btnColor)
    return(
        <button 
        className={`simon-btn ${btnColor} ${flash}`} 
        onClick={props.flashButton} 
        key={props.index}
        ></button>
        
    )
}
