import { StyleSheet } from "react-native";
import COLORS from "./COLORS";

const customstyles = StyleSheet.create({
    mt_5:{
        marginTop:5,
    },
    mt_10:{
        marginTop:10,
    },
    mt_20:{
        marginTop:20,
    },
    mr_5:{
        marginRight:5,
    },
    mr_10:{
        marginRight:10,
    },
    ml_5:{
        marginLeft:5,
    },
    ml_10:{
        marginLeft:10,
    },
    my_5:{
        marginVertical:5,
    },
    my_10:{
        marginVertical:10,
    },
    mh_10:{
        marginHorizontal:10,
    },
    text_red_800:{
        color:COLORS.red_800,
    },
    textbold_800:{
        fontWeight:800,
    },
    grid:{
        flexDirection:'row',
    },
    space_between:{
         justifyContent:"space-between",
    }
});


export default customstyles;