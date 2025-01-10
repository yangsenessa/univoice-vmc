import { Key, useState } from 'react';
import style from './chakra.module.scss'

function ChakraComponent( props:{ idx: number, clickcnt: number } ) {
  const [totalClick, setTotalClick] = useState(0);
  const [fadeElements, setFadeElements] = useState<any>([]);
  const fadeAnimationDuration = 1000; // 淡出动画时长
  
  const clickChakra = () => {
    addFadeElement()
    // TODO: 后台 props.idx 号脉轮点击数+1
  }

  let eles: any[] = []
  
  // 点chakra+1效果
  const addFadeElement = () => {
    const newElement = {
      id: Date.now(), // 使用当前时间戳作为唯一ID
      animating: true,
    };
    eles = [...eles, newElement]
    setFadeElements(eles);
 
    // 设置一个定时器来在动画结束后删除元素
    setTimeout(() => {
      eles = eles.filter((el: { id: any; }) => el.id !== newElement.id)
      setFadeElements(eles);
    }, fadeAnimationDuration);

    setTotalClick(totalClick + 1)
  };

  return (
    <div className={`${style.chakra} ${style['chakra_' + props.idx]}`}>
      <div className={`${props.idx % 2 === 1 ? style.chakra_right : style.chakra_left}`}>
        <div className={style.chakra_circle} onClick={clickChakra}></div>
        <div className={style.chakra_click_count}>🧡{props.clickcnt + totalClick}</div>
        <div className={style.fade_area}>
        {fadeElements.map((el: { id: Key | null | undefined; animating: any; }) => (
          <div key={el.id} className={style.fade_out_text}>+1</div>
        ))}
        </div>
      </div>
    </div>
  )
}
export default ChakraComponent;