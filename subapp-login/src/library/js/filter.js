
import moment from 'moment'

export const YYMMDDFilter = (timestamp) =>{
    if(timestamp){
        return moment(timestamp).format('YYYY-MM-DD')
    }else{
        return null;
    }
}

export const YYMMFilter = (timestamp) =>{
    if(timestamp){
        return  moment(timestamp).format('YYYY-MM-DD');
    }else{
        return null;
    }
}

export const moneyFilter = (money) =>{
    if(money){
        return  money.toLocaleString();
     }else{
         return 0;
     }
}