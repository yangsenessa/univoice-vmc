import { Key, useState } from 'react';
import style from './chakra.module.scss'
import {update_chakra_data,query_chakra_data} from '@/utils/call_vmc_backend'
import { useAcountStore } from '@/stores/user';
import type {ChakraItem} from 'declarations/univoice-vmc-backend/univoice-vmc-backend.did';

function ChakraComponent( props:{ idx: number, clickcnt: number } ) {
  const [totalClick, setTotalClick] = useState(0);
  const [fadeElements, setFadeElements] = useState<any>([]);
  const fadeAnimationDuration = 1000; // 淡出动画时长
  const { getPrincipal } = useAcountStore();

  
  const clickChakra = () => {
    addFadeElement();
    // TODO: 后台 props.idx 号脉轮点击数+1
    sendToBackendStore();
  }

  const sendToBackendStore = () => {
    let principal_id = getPrincipal();
    console.log("Save chakra with", props.idx, props.clickcnt+totalClick);
    let idx_param = props.idx;
    let click_param = props.clickcnt+totalClick;

     query_chakra_data(getPrincipal()).then(
           resultItem =>{
           let dataItem = {
             pricipalid_txt: principal_id,
             cnt1 : resultItem.cnt1,
             cnt2 : resultItem.cnt2,
             cnt3 : resultItem.cnt3,
             cnt4 : resultItem.cnt4,
             cnt5 : resultItem.cnt5,
             cnt6 : resultItem.cnt6,
             cnt7 : resultItem.cnt7
           };
           if (idx_param ==1)  {
             dataItem.cnt1 = BigInt(click_param);
           }
           if (idx_param ==2)  {
            dataItem.cnt2 = BigInt(click_param);
           }
           if (idx_param ==3)  {
            dataItem.cnt3 = BigInt(click_param);
           }
           if (idx_param ==4)  {
            dataItem.cnt4 = BigInt(click_param);
           }
           if (idx_param ==5)  {
            dataItem.cnt5 = BigInt(click_param);
           }
           if (idx_param ==6)  {
            dataItem.cnt6 = BigInt(click_param);
           }
           if (idx_param ==7)  {
            dataItem.cnt7 = BigInt(click_param);
           }
           update_chakra_data(dataItem);
         }
         

        );

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