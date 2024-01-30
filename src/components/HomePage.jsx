import "../styles/PageStyles.css";
import logo from '../logo.svg';

const HomePage = () =>{
    return (
        <div>
            <div className="NavPanel">
                <img src={logo} className="Logo" alt="logo" />
                <button className="mainButton" type="button">sampletext</button><br/>
                <button className="mainButton" type="button">sampletext</button>
            </div>
            <p className="HomeStoreLabel" >PLATO'S CLOSET - {"ZippyDee (<employee ranking>)"}</p>
        </div>
    );
}

export default HomePage;