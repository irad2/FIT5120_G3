import React, {useState, useEffect} from 'react';
import sunscreenKid from '../assets/character/sunscreen.svg';
import outsideKid from '../assets/character/outside.svg';
import sunburnKid from '../assets/character/sunburnt.svg';
import indoorsKid from '../assets/character/inside.svg';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles((theme) => ({
  image: {
    width: 130,
    height: 130,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export default function Character(props) {
  const classes = useStyles();
  const [src, setSrc] = useState(outsideKid);

  useEffect(() => {
    //Preloading character assets
    const imageList = [outsideKid, sunburnKid, indoorsKid]
    imageList.forEach((image) => {
        new Image().src = image
    });
  }, []);
    useEffect(() => {
      if (props.sunburn > 50) {
        setSrc(sunburnKid)
      } else if (props.outdoors == false) {
        setSrc(indoorsKid)
      } else if (props.sunscreen == true) {
        setSrc(sunscreenKid)
      } else {
        setSrc(outsideKid)
      }
      })
    
  // useEffect(() => {
  //   if (props.age === 0) {
  //     setSrc(bornPet);
  //   } else if (props.health === 0) {
  //     setSrc(deadPet);
  //   } else if (props.image) {
  //     setSrc(props.image);
  //   } else if (props.age > 3) {
  //     if (props.happiness >= 70 && props.happiness <= 90) {   
  //       setSrc(happyPet);
  //     } else if (props.happiness <= 30 && props.happiness > 0){
  //       setSrc(sadPet);
  //     } else if (props.happiness > 90){
  //       setSrc(lovePet);
  //     } else if (props.happiness === 0) {
  //       setSrc(cryingPet);
  //     } else {
  //       setSrc(welcomePet);
  //     }
  //   }
  // }, [props.age, props.happiness, props.health, props.image]);

  return (
    <Zoom in={true} style={{ transitionDelay: '500ms' }}>
      <div>
        <img className={classes.img} alt={props.name} src={src} />
      </div>
    </Zoom>
  );
}