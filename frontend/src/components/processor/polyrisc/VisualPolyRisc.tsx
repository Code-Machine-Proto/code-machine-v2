import ALU from "@src/components/processor/parts/ALU";
import Multiplexer from "@src/components/processor/parts/Multiplexer";
import ObscureMemory from "@src/components/processor/parts/ObscureMemory";
import RegisterBox from "@src/components/processor/parts/RegisterBox";
import Bus from "@src/components/processor/parts/Bus";
import { useContext } from "react";
import { ProcessorContext } from "@src/components/code/CodeProvider";
import { LineStatePolyRisc } from "@src/interface/Line";

/**
 * Affiche le chemin de donnée du processeur PolyRisc
 * @returns le composant react
 */
export default function VisualPolyRisc() {
    const currentStep = useContext(ProcessorContext).currentStep;

    const lineState = currentStep.stimulatedLineState;

    const fetch = lineState == LineStatePolyRisc.fetch;
    const decode = lineState == LineStatePolyRisc.decode;
    const opTwoReg = lineState == LineStatePolyRisc.opTwoReg;
    const opThreeReg = lineState == LineStatePolyRisc.opThreeReg;
    const load = lineState == LineStatePolyRisc.load;
    const store = lineState == LineStatePolyRisc.store;
    const loadI = lineState == LineStatePolyRisc.loadI;
    const branching = lineState == LineStatePolyRisc.branching;
    const nop = lineState == LineStatePolyRisc.nop || opTwoReg || opThreeReg || load || store || loadI;

    return (
        <svg width="100%" height="100%" viewBox="0 0 1231 400" fill="none" xmlns="http://www.w3.org/2000/svg">

            <path
                id="mux-pc"
                d="M76 169C75.4477 169 75 169.448 75 170C75 170.552 75.4477 171
                   76 171V169ZM135 170L125 164.226V175.774L135 170ZM76 170V171H126V170V169H76V170Z"
            />
            <use href="#mux-pc" fill="white" />
            <path
                id="pc-inst"
                d="M255 169C254.448 169 254 169.448 254 170C254 170.552 254.448 171 255 171V169ZM314
                   170L304 164.226V175.774L314 170ZM255 170V171H305V170V169H255V170Z"
            />
            <use href="#pc-inst" fill="white" />
            <path
                id="inst-ir"
                d="M408 169C407.448 169 407 169.448 407 170C407 170.552 407.448 171 408 171V169ZM467
                   170L457 164.226V175.774L467 170ZM408 170V171H458V170V169H408V170Z"
            />
            <use href="#inst-ir" fill="white" />
            <path
                id="pc-mux"
                d="M282 101C282.048 101 282.096 101.004 282.143 101.011C282.19 101.018 282.236 101.027
                   282.281 101.04C282.306 101.047 282.33 101.055 282.354 101.064C282.359 101.066 282.364
                   101.068 282.369 101.07C282.386 101.077 282.402 101.085 282.419 101.093C282.463 101.113
                   282.505 101.136 282.545 101.162C282.555 101.169 282.565 101.176 282.575 101.183C282.594
                   101.196 282.612 101.209 282.63 101.224C282.634 101.227 282.637 101.23 282.641 101.233C282.66
                   101.249 282.678 101.266 282.696 101.283C282.703 101.29 282.709 101.296 282.716 101.303C282.732
                   101.319 282.748 101.337 282.763 101.354C282.767 101.36 282.772 101.365 282.776 101.37C282.79
                   101.387 282.802 101.404 282.814 101.421C282.822 101.431 282.828 101.441 282.835 101.451C282.862
                   101.492 282.886 101.536 282.907 101.581C282.913 101.593 282.92 101.605 282.925 101.618C282.961
                   101.706 282.985 101.799 282.995 101.897L283 102V170C283 170.552 282.552 171 282 171H255C254.448
                   171 254 170.552 254 170C254 169.448 254.448 169 255 169H281V103H2V149H29V144.227L39 150L29
                   155.773V151H1C0.447715 151 0 150.552 0 150V102C0 101.448 0.447715 101 1 101H282Z"
            />
            <use href="#pc-mux" fill="white" />
            <path
                id="mux-reg"
                d="M691 89C690.448 89 690 89.4477 690 90C690 90.5523 690.448
                   91 691 91V89ZM758 90L748 84.2265V95.7735L758 90ZM691 90V91H749V90V89H691V90Z"
            />
            <use href="#mux-reg" fill="white" />
            <path
                id="ir-reg"
                d="M654 116L644 121.773V117H617V170C617 170.552 616.552 171 616 171H587C586.448 171 586 170.552 586 170C586 169.448 586.448 169 587 169H615V116C615 115.448 615.448 115 616 115H644V110.227L654 116Z"
            />
            <use href="#ir-reg" fill="white" />
            <path
                id="ir-rdst"
                d="M672 169C672.056 169 672.111 169.006 672.165 169.015C672.174 169.016 672.183 169.017 672.191
                   169.019L672.201 169.021C672.211 169.023 672.221 169.025 672.23 169.027C672.251 169.032
                   672.272 169.037 672.292 169.043C672.341 169.058 672.387 169.078 672.433 169.1C672.447 169.106
                   672.461 169.113 672.475 169.12C672.56 169.166 672.639 169.225 672.707 169.293L683.414
                   180H748V175.227L758 181L748 186.773V182H683C682.993 182 682.986 181.999 682.979 181.999C682.963
                   181.999 682.948 181.997 682.932 181.996C682.914 181.995 682.896 181.993 682.878 181.991C682.86
                   181.989 682.843 181.986 682.825 181.983C682.814 181.981 682.803 181.98 682.792 181.978C682.739
                   181.966 682.687 181.95 682.637 181.931C682.625 181.926 682.614 181.923 682.603 181.918C682.52
                   181.882 682.441 181.835 682.368 181.775L682.293 181.707L671.586 171H587C586.448 171 586 170.552
                   586 170C586 169.448 586.448 169 587 169H672Z"
            />
            <use href="#ir-rdst" fill="white" />
            <path
                id="ir-rsrc1"
                d="M657.103 169.005C657.23 169.018 657.349 169.055 657.458 169.111C657.468 169.116 657.477
                   169.122 657.486 169.127C657.564 169.17 657.634 169.223 657.697 169.284C657.7 169.287
                   657.704 169.29 657.707 169.293L668.709 180.295L668.778 180.371C668.941 180.57 669.014
                   180.818 669 181.061V200H748V195.227L758 201L748 206.773V202H668C667.448 202 667 201.552
                   667 201V181.414L656.586 171H587C586.448 171 586 170.552 586 170C586 169.448 586.448 169
                   587 169H657L657.103 169.005Z"
            />
            <use href="#ir-rsrc1" fill="white" />
            <path
                id="ir-rsrc2"
                d="M641.103 169.005C641.23 169.018 641.349 169.055 641.458 169.111C641.468 169.116 641.477
                169.122 641.486 169.127C641.564 169.17 641.634 169.223 641.697 169.284C641.7 169.287 641.704
                169.29 641.707 169.293L652.709 180.295L652.778 180.371C652.941 180.57 653.014 180.818 653
                181.061V220H748V215.227L758 221L748 226.773V222H652C651.448 222 651 221.552 651
                221V181.414L640.586 171H587C586.448 171 586 170.552 586 170C586 169.448 586.448 169
                587 169H641L641.103 169.005Z"
            />
            <use href="#ir-rsrc2" fill="white" />
            <path
                id="ir-pc"
                d="M625 169C625.056 169 625.111 169.006 625.165 169.015C625.174 169.016 625.183 169.017 625.191
                169.019L625.201 169.021C625.211 169.023 625.221 169.025 625.23 169.027C625.251 169.032 625.272
                169.037 625.292 169.043C625.341 169.058 625.387 169.078 625.433 169.1C625.447 169.106 625.461
                169.113 625.475 169.12C625.56 169.166 625.639 169.225 625.707 169.293L636.709 180.295L636.778
                180.371C636.941 180.57 637.014 180.818 637 181.061V343C637 343.048 636.995 343.096 636.988
                343.143C636.985 343.162 636.983 343.182 636.979 343.201C636.964 343.278 636.938 343.35 636.906
                343.419C636.886 343.463 636.863 343.505 636.837 343.545C636.83 343.555 636.823 343.565 636.816
                343.575C636.786 343.618 636.752 343.659 636.716 343.696C636.709 343.703 636.703 343.709 636.696
                343.716C636.68 343.732 636.662 343.748 636.645 343.763C636.639 343.767 636.634 343.772 636.629
                343.776C636.612 343.79 636.595 343.802 636.578 343.814C636.568 343.822 636.558 343.828 636.548
                343.835C636.529 343.847 636.51 343.858 636.491 343.869C636.484 343.873 636.477 343.878 636.47
                343.882C636.453 343.891 636.435 343.899 636.418 343.907C636.406 343.913 636.394 343.92 636.381
                343.925C636.358 343.934 636.334 343.942 636.311 343.95C636.306 343.952 636.301 343.954 636.296
                343.955C636.234 343.974 636.169 343.988 636.103 343.995C636.069 343.999 636.035 344 636
                344H1.06152C1.04115 344.001 1.02069 344.003 1 344.003C0.447715 344.003 0 343.555 0
                343.003V193L0.00488281 192.897C0.0115531 192.832 0.0242574 192.768 0.0429688 192.707C0.0568812
                192.662 0.0747533 192.618 0.0947266 192.575C0.114813 192.533 0.137394 192.491 0.163086
                192.452C0.171811 192.439 0.181097 192.426 0.19043 192.413C0.199051 192.401 0.207675
                192.389 0.216797 192.378C0.224712 192.368 0.232929 192.358 0.241211 192.349C0.276998
                192.307 0.316302 192.269 0.358398 192.233C0.362103 192.23 0.36539 192.227 0.369141
                192.224C0.386811 192.209 0.405188 192.196 0.423828 192.183C0.433779 192.176 0.443887
                192.169 0.454102 192.162C0.469379 192.152 0.485136 192.143 0.500977 192.134C0.513587
                192.127 0.526112 192.119 0.539062 192.112C0.548354 192.107 0.557923 192.103 0.567383
                192.099C0.586373 192.09 0.605367 192.08 0.625 192.072C0.635191 192.068 0.645896 192.065
                0.65625 192.062C0.676582 192.054 0.696848 192.046 0.717773 192.04C0.723517 192.038 0.729566
                192.038 0.735352 192.036C0.759461 192.03 0.783794 192.023 0.808594 192.019C0.811536 192.018
                0.814431 192.017 0.817383 192.017C0.87659 192.006 0.937631 192 1 192H29V187.227L39 193L29
                198.773V194H2V342H635V181.414L624.586 171H587C586.448 171 586 170.552 586 170C586 169.448
                586.448 169 587 169H625Z"
            />
            <use href="#ir-pc" fill="white" />
            <path
                id="reg-A"
                d="M852 135C851.448 135 851 135.448 851 136C851 136.552 851.448 137 852 137V135ZM919 136L909
                   130.226V141.774L919 136ZM852 136V137H910V136V135H852V136Z"
            />
            <use href="#reg-A" fill="white" />
            <path
                id="reg-B"
                d="M852 216C851.448 216 851 216.448 851 217C851 217.552 851.448 218 852 218V216ZM919 217L909
                   211.226V222.774L919 217ZM852 217V218H910V217V216H852V217Z"
            />
            <use href="#reg-B" fill="white" />
            <path
                id="alu-reg"
                d="M1044 24C1044.55 24 1045 24.4477 1045 25V176C1045 176.552 1044.55 177 1044 177H986C985.448
                   177 985 176.552 985 176C985 175.448 985.448 175 986 175H1043V26H617V59H644V54.2266L654 60L644
                   65.7734V61H616C615.448 61 615 60.5523 615 60V25C615 24.4477 615.448 24 616 24H1044Z"
            />
            <use href="#alu-reg" fill="white" />
            <path
                id="reg-data"
                d="M1102 215L1092 220.773V216H1046V301C1046 301.004 1046 301.007 1046 301.011C1046 301.015 1046
                   301.02 1046 301.024C1046 301.542 1045.6 301.966 1045.1 302.015L1044.99 302.019L880.104
                   301C880.069 301.004 880.035 301.006 880 301.006C879.448 301.006 879 300.558 879
                   300.006V218H852C851.448 218 851 217.552 851 217C851 216.448 851.448 216 852 216H880C880.048
                   216 880.096 216.004 880.143 216.011C880.19 216.017 880.236 216.027 880.281 216.04C880.306
                   216.047 880.33 216.055 880.354 216.064C880.359 216.066 880.364 216.068 880.369 216.07C880.386
                   216.077 880.402 216.085 880.419 216.093C880.437 216.101 880.455 216.109 880.472 216.118C880.477
                   216.121 880.481 216.124 880.486 216.127C880.506 216.138 880.526 216.15 880.545 216.162C880.555
                   216.169 880.565 216.176 880.575 216.183C880.594 216.196 880.612 216.209 880.63 216.224C880.634
                   216.227 880.637 216.23 880.641 216.233C880.66 216.249 880.678 216.266 880.696 216.283C880.703
                   216.29 880.709 216.296 880.716 216.303C880.732 216.319 880.748 216.337 880.763 216.354C880.767
                   216.36 880.772 216.365 880.776 216.37C880.79 216.387 880.802 216.404 880.814 216.421C880.822
                   216.431 880.828 216.441 880.835 216.451C880.861 216.491 880.884 216.532 880.904 216.575C880.912
                   216.591 880.919 216.606 880.926 216.622C880.961 216.709 880.985 216.801 880.995 216.897L881
                   217V299.006L1044 300.012V215C1044 214.448 1044.45 214 1045 214H1092V209.227L1102 215Z"
            />
            <use href="#reg-data" fill="white" />
            <path
                id="reg-addr"
                d="M1067 82C1067.55 82 1068 82.4477 1068 83V142H1092V137.227L1102 143L1092 148.773V144H1067C1066.45
                   144 1066 143.552 1066 143V84H892V124.94C892.015 125.184 891.941 125.432 891.778 125.632L891.709
                   125.707L880.707 136.71C880.497 136.92 880.217 137.016 879.942 137H852C851.448 137 851 136.552 851
                   136C851 135.448 851.448 135 852 135H879.589L890 124.588V83C890 82.4477 890.448 82 891 82H1067Z"
            />
            <use href="#reg-addr" fill="white" />
            <path
                id="mem-reg"
                d="M1229 0C1229.55 0 1230 0.447715 1230 1V174.832C1230.01 174.887 1230.01 174.943 1230.01 175C1230.01
                   175.518 1229.62 175.944 1229.12 175.995L1229.01 176H1195C1194.45 176 1194 175.552 1194 175C1194
                   174.448 1194.45 174 1195 174H1228V2H582V87H644V82.2266L654 88L644 93.7734V89H581C580.448 89 580
                   88.5523 580 88V1C580 0.447715 580.448 0 581 0H1229Z"
            />
            <use href="#mem-reg" fill="white" />
            <path
                id="ir-control1"
                d="M605.103 169.005C605.23 169.018 605.349 169.055 605.458 169.111C605.468 169.116 605.477 169.122
                   605.486 169.127C605.564 169.17 605.634 169.223 605.697 169.284C605.7 169.287 605.704 169.29
                   605.707 169.293L616.709 180.295C616.916 180.502 617.013 180.778 617 181.05V255H696L696.103
                   255.005C696.169 255.012 696.234 255.025 696.296 255.044C696.301 255.045 696.306 255.047 696.311
                   255.049C696.334 255.057 696.358 255.065 696.381 255.074C696.394 255.079 696.406 255.086 696.418
                   255.092C696.435 255.1 696.453 255.108 696.47 255.117C696.477 255.121 696.484 255.126 696.491
                   255.13C696.51 255.141 696.529 255.152 696.548 255.164C696.558 255.171 696.568 255.178 696.578
                   255.185C696.595 255.197 696.612 255.209 696.629 255.223C696.634 255.227 696.639 255.232 696.645
                   255.236C696.662 255.251 696.68 255.267 696.696 255.283C696.703 255.29 696.709 255.296 696.716
                   255.303C696.752 255.34 696.786 255.381 696.816 255.424C696.823 255.434 696.83 255.444 696.837
                   255.454C696.863 255.494 696.886 255.536 696.906 255.58C696.927 255.624 696.945 255.67 696.959
                   255.718C696.972 255.763 696.981 255.809 696.988 255.856C696.995 255.903 697 255.951 697
                   256V350H701.773L696 360L690.227 350H695V257H616C615.448 257 615 256.552 615 256V181.414L604.586
                   171H587C586.448 171 586 170.552 586 170C586 169.448 586.448 169 587 169H605L605.103 169.005Z"
            />
            <use href="#ir-control1" fill="white" />
            <path
                id="ir-control2"
                d="M599 169C599.056 169 599.111 169.006 599.165 169.015C599.174 169.016 599.183 169.017 599.191
                   169.019L599.201 169.021C599.211 169.023 599.221 169.025 599.23 169.027C599.251 169.032 599.272
                   169.037 599.292 169.043C599.341 169.058 599.387 169.078 599.433 169.1C599.447 169.106 599.461
                   169.113 599.475 169.12C599.56 169.166 599.639 169.225 599.707 169.293L610.709 180.295C610.916
                   180.502 611.013 180.778 611 181.05V270H675C675.552 270 676 270.448 676 271V350H680.773L675
                   360L669.227 350H674V272H610C609.448 272 609 271.552 609 271V181.414L598.586 171H587C586.448
                   171 586 170.552 586 170C586 169.448 586.448 169 587 169H599Z"
            />
            <use href="#ir-control2" fill="white" />

            <Bus x={285} y={160} number={12}/>
            <Bus x={410} y={160} number={28}/>
            <Bus x={590} y={160} number={28}/>
            <Bus x={620} y={106} number={16}/>
            <Bus x={590} y={333} number={12}/>
            <Bus x={720} y={171} number={5}/>
            <Bus x={720} y={191} number={5}/>
            <Bus x={720} y={210} number={5}/>
            <Bus x={855} y={126} number={16}/>
            <Bus x={855} y={207} number={16}/>
            <Bus x={900} y={73} number={8}/>
            <Bus x={995} y={166} number={16}/>
            <Bus x={1200} y={165} number={16}/>
            <Bus x={670} y={247} number={4} />
            <Bus x={645} y={262} number={4} />

            <use href="#mux-pc" className={ branching || nop ? "fill-red-500" : "" } />
            <use href="#pc-inst" className={ fetch ? "fill-red-500" : "" } />
            <use href="#inst-ir" className={ fetch ? "fill-red-500" : "" } />
            <use href="#pc-mux" className={ nop ? "fill-red-500" : "" } />
            <use href="#mux-reg" className={ opTwoReg || opThreeReg || load || loadI ? "fill-red-500" : "" } />
            <use href="#ir-reg" className={ loadI ? "fill-red-500" : "" } />
            <use href="#ir-rdst" className={ opTwoReg || opThreeReg || load || loadI ? "fill-red-500" : "" } />
            <use href="#ir-rsrc1" className={ opTwoReg || opThreeReg || load || store ? "fill-red-500" : "" } />
            <use href="#ir-rsrc2" className={ opThreeReg || store ? "fill-red-500" : "" } />
            <use href="#ir-pc" className={ branching ? "fill-red-500" : "" } />
            <use href="#reg-A" className={ opTwoReg || opThreeReg ? "fill-red-500" : "" } />
            <use href="#reg-B" className={ opThreeReg ? "fill-red-500" : "" } />
            <use href="#alu-reg" className={ opTwoReg || opThreeReg ? "fill-red-500" : "" } />
            <use href="#reg-data" className={ store ? "fill-red-500" : "" } />
            <use href="#reg-addr" className={ load || store ? "fill-red-500" : "" } />
            <use href="#mem-reg" className={ load ? "fill-red-500" : "" } />
            <use href="#ir-control1" className={ decode ? "fill-red-500" : "" } />
            <use href="#ir-control2" className={ decode ? "fill-red-500" : "" } />

            <Multiplexer name="do_branch" x={37} y={130} isActivated={ branching || nop } />
            <Multiplexer name="sel_reg_data" x={652} y={47} isActivated={ opTwoReg || opThreeReg || load || loadI } />

            <ALU x={920} y={100} hasNz={true} isActivated={ opTwoReg || opThreeReg } />
            
            <ObscureMemory name="Mémoire d'instruction" className="fill-green-700" x={313} y={70} >
                <text x={5} y={182} dominantBaseline="middle" fill="black" >addr</text>
                <text x={165} y={182} dominantBaseline="middle" textAnchor="end" fill="black">data_in</text>
            </ObscureMemory>

            <ObscureMemory name="Registres" className="fill-yellow-300" x={757} y={70} hasControlSignal={true} controlName="wr_reg" isWritable={ opTwoReg || opThreeReg || load || loadI } >
                <text x={5} y={35} dominantBaseline="middle" fill="black">data_in</text>
                <text x={5} y={201} dominantBaseline="middle" fill="black">rdst</text>
                <text x={5} y={238} dominantBaseline="middle" fill="black">rsrc1</text>
                <text x={5} y={275} dominantBaseline="middle" fill="black">rsrc2</text>
                <text x={165} y={122.5} dominantBaseline="middle" textAnchor="end" fill="black">A</text>
                <text x={165} y={267.5} dominantBaseline="middle" textAnchor="end" fill="black">B</text>
            </ObscureMemory>
            <ObscureMemory name="Mémoire de données" className="fill-green-500" x={1101} y={70} hasControlSignal={true} controlName="wr_mem" isWritable={ store } >
                <text x={5} y={132.5} dominantBaseline="middle" fill="black">addr</text>
                <text x={5} y={264} dominantBaseline="middle" fill="black">data_in</text>
                <text x={165} y={190} dominantBaseline="middle" textAnchor="end" fill="black">data_out</text>
            </ObscureMemory>

            <RegisterBox name="PC" className="bg-pc" number={currentStep.pcState} x={134.5} y={137.5} isActivated={ nop || branching } />
            <RegisterBox name="IR" className="bg-ir" number={currentStep.irState} x={467.5} y={137.5} isActivated={ fetch } />

            <circle cx="282" cy="170" r="5" className={ fetch || nop ? "fill-red-500" : "fill-white" } />
            <circle cx="616" cy="170" r="5" className={ opTwoReg || opThreeReg || branching || load || store || loadI ? "fill-red-500" : "fill-white" } />
            <circle cx="880" cy="217" r="5" className={ opThreeReg || store ? "fill-red-500" : "fill-white" } />

            <g>
                <rect x="134.5" y="82.5" width="39" height="39" fill="white" stroke="black"/>
                <text x={154} y={102} textAnchor="middle" dominantBaseline="middle" className="fill-black text-xl">+1</text>
            </g>
            <g>
                <rect x="264.5" y="360.5" width="799" height="39" fill="white" stroke="black"/>
                <text x={ 664 } y={ 380 } textAnchor="middle" dominantBaseline="middle" className="text-xl font-semibold fill-black">Control Signal</text>
            </g>
        </svg>
    );
}
