export default function Button(props) {
    let btnColor= props.btnColor;
    let flash= props.flash;
    console.log(props)
    return(
        <button className={`simon-btn ${btnColor} ${flash}`}>{btnColor}</button>
        
    )
}
