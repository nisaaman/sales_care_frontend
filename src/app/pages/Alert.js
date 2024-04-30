import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
export function showError(msg) {
    return toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
        autoClose: 5000,
        pauseOnHover:true,
        pauseOnFocusLoss: true,
        progress:false,
        draggable:true,
        hideProgressBar:false
    });
}

export function showSuccess(msg) {
    return toast.success(msg, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
        autoClose: 5000,
        pauseOnHover:true,
        pauseOnFocusLoss: true,
        progress:false,
        draggable:true,
        hideProgressBar:true
    });
}

export function showInfo(msg) {
    return toast.warning(msg, {
        position: toast.POSITION.TOP_RIGHT,
        theme: "colored",
        autoClose: 5000,
        pauseOnHover:true,
        pauseOnFocusLoss: true,
        progress:false,
        draggable:true,
        hideProgressBar:true
    });
}

export function percentRangeValidator(e) {
    if(e.target.value === '0' && e.key === '0'){
        e.preventDefault();
    }
    
    /* var value = '';
    if(e.key === '.'){
        value = e.target.value + '.0';
    }else{
        if(e.target.value.split('.')[1] == undefined){ alert(e.target.value);
            value = e.target.value+e.key;
        }else{ alert(e.target.value);
            value = e.target.value.split('.')[0] + '.' + e.target.value.split('.')[1] + e.key;
        }
        
    }
    alert(value); */

    const regex = /[0-9.]/;

    if(e.target.value > 100 || e.target.value < 0 || e.key === "E" || e.key === "e" || e.key === "-"){
        e.preventDefault();
    }

    if (!e.target.value && e.key === 0) {
        e.preventDefault();
    } else {
        // If the key pressed is not a number or a period, nothing is printed
        if (!regex.test(e.key)) {
            e.preventDefault();

        }

    }
}
  
export function numberValidator(e) {
    const regex = /[0-9.]/;
    // console.log("called"+e.target.value)
    // if(e.target.value === '0' && e.key === '0'){
    //     e.preventDefault();
    // }

    // if(e.key === "E" || e.key === "e" || e.key === "-") {
    //     e.preventDefault();
    // }
    
    // If the input is empty and the key pressed is "0" nothing is printed
    if (!e.target.value && e.key === 0) {
        e.preventDefault();
    } else {
        // If the key pressed is not a number or a period, nothing is printed
        if (!regex.test(e.key)) {
            e.preventDefault();

        }

    }
}