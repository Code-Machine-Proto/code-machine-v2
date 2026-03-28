import RegisterBox, { REGISTER_8_BIT } from "./parts/RegisterBox";
import ALU from "./parts/ALU";
import Bus from "./parts/Bus";
import Multiplexer from "./parts/Multiplexer";
import ObscureMemory from "./parts/ObscureMemory";

// LineStateAccumulator: -1 error, 0 fetch, 1 load, 2 store, 3 decode, 4 alu, 5 nop, 6 branching

interface VisualProps {
  stimulatedLineState: number;
  registers: Record<string, number>;
}

export default function VisualAccumulator(props: VisualProps) {
  const ls = () => props.stimulatedLineState;

  const pcVal = () => props.registers["PC"] ?? 0;
  const irVal = () => props.registers["IR"] ?? 0;
  const accVal = () => props.registers["ACC"] ?? 0;

  const fetch = () => ls() === 0;
  const load = () => ls() === 1;
  const store = () => ls() === 2;
  const decode = () => ls() === 3;
  const alu = () => ls() === 4;
  const nop = () => ls() === 5;
  const branching = () => ls() === 6;
  const inc = () => nop() || load() || store() || alu();

  return (
    <svg viewBox="0 0 1131 442" class="w-full h-full" style="max-height: 100%; max-width: 100%;" preserveAspectRatio="xMidYMid meet" fill="none">

      {/* === Wire path definitions === */}
      <path
        id="mux-pc"
        d="M66 131C65.4477 131 65 131.448 65 132C65 132.552 65.4477 133 66 133V131ZM121.145 132L111.145
           126.226V137.774L121.145 132ZM66 132V133H112.145V132V131H66V132Z"
      />
      <use href="#mux-pc" class="circuit-wire"/>
      <path
        id="pc-mux"
        d="M241 136C240.448 136 240 136.448 240 137C240 137.552 240.448 138 241 138V136ZM314 137L304
           131.226V142.774L314 137ZM241 137V138H305V137V136H241V137Z"
      />
      <use href="#pc-mux" class="circuit-wire"/>
      <path
        id="inc"
        d="M277 68C277.552 68 278 68.4477 278 69V137C278 137.552 277.552 138 277 138H241C240.448 138 240
           137.552 240 137C240 136.448 240.448 136 241 136H276V70H3V109H18V104.227L28 110L18
           115.773V111H2C1.44772 111 1 110.552 1 110V69C1 68.4477 1.44772 68 2 68H277Z"
      />
      <use href="#inc" class="circuit-wire"/>
      <path
        id="mux-mem"
        d="M351 160C350.448 160 350 160.448 350 161C350 161.552 350.448 162 351 162V160ZM424 161L414
           155.226V166.774L424 161ZM351 161V162H415V161V160H351V161Z"
      />
      <use href="#mux-mem" class="circuit-wire"/>
      <path
        id="mem-alu"
        d="M518 173C517.448 173 517 173.448 517 174C517 174.552 517.448 175 518 175V173ZM661 174L651
           168.226V179.774L661 174ZM518 174V175H652V174V173H518V174Z"
      />
      <use href="#mem-alu" class="circuit-wire"/>
      <path
        id="mux-acc"
        d="M853 195C852.448 195 852 195.448 852 196C852 196.552 852.448 197 853 197V195ZM941.006
           196L931.006 190.226V201.774L941.006 196ZM853 196V197H932.006V196V195H853V196Z"
      />
      <use href="#mux-acc" class="circuit-wire"/>
      <path
        id="mem-mux"
        d="M770 101C770.552 101 771 101.448 771 102V173H806V168.227L816 174L806 179.773V175H770C769.448
           175 769 174.552 769 174V103H589V174C589 174.552 588.552 175 588 175H518C517.448 175 517 174.552
           517 174C517 173.448 517.448 173 518 173H587V103C587 102.818 587.05 102.647 587.135 102.5C587.05
           102.353 587 102.182 587 102C587 101.448 587.448 101 588 101H770Z"
      />
      <use href="#mem-mux" class="circuit-wire"/>
      <path
        id="alu-mux"
        d="M728 215C727.448 215 727 215.448 727 216C727 216.552 727.448 217 728 217V215ZM816 216L806
           210.226V221.774L816 216ZM728 216V217H807V216V215H728V216Z"
      />
      <use href="#alu-mux" class="circuit-wire"/>
      <path
        id="mem-ir"
        d="M588 173C588.09 173 588.178 173.013 588.261 173.035C588.271 173.038 588.282 173.04 588.293
           173.043C588.374 173.068 588.45 173.104 588.521 173.147C588.532 173.155 588.544 173.161 588.556
           173.169C588.585 173.189 588.613 173.21 588.64 173.232C588.661 173.25 588.682 173.268 588.702
           173.288L588.707 173.293C588.716 173.302 588.724 173.313 588.733 173.322C588.746 173.335
           588.758 173.348 588.77 173.362C588.802 173.401 588.83 173.443 588.856 173.486C588.864 173.498
           588.871 173.51 588.878 173.522C588.914 173.588 588.942 173.659 588.963 173.732C588.969 173.754
           588.975 173.776 588.979 173.799C588.987 173.833 588.992 173.869 588.995 173.904C588.998 173.934
           589 173.964 589 173.994L589.992 330.88C589.997 330.919 590 330.959 590 331C590 331.552 589.552
           332 589 332H78C77.8175 332 77.6473 331.95 77.5 331.864C77.3527 331.95 77.1825 332 77
           332C76.4477 332 76 331.552 76 331V255C76 254.448 76.4477 254 77 254H111V249.227L121 255L111
           260.773V256H78V330H587.987L587.006 175H518C517.448 175 517 174.552 517 174C517 173.448
           517.448 173 518 173H588Z"
      />
      <use href="#mem-ir" class="circuit-wire"/>
      <path
        id="acc-control"
        d="M1101 195C1101.55 195 1102 195.448 1102 196V372H1106.77L1101 382L1095.23 372H1100V197H1061C1060.45
           197 1060 196.552 1060 196C1060 195.448 1060.45 195 1061 195H1101Z"
      />
      <use href="#acc-control" class="circuit-wire"/>
      <path
        id="acc-mem"
        d="M1101 0C1101.55 0 1102 0.447715 1102 1V196C1102 196.552 1101.55 197 1101 197H1061C1060.45
           197 1060 196.552 1060 196C1060 195.448 1060.45 195 1061 195H1100V2H382V84H414V79.2266L424
           85L414 90.7734V86H381C380.448 86 380 85.5523 380 85V1C380 0.447715 380.448 0 381 0H1101Z"
      />
      <use href="#acc-mem" class="circuit-wire"/>
      <path
        id="acc-alu"
        d="M1101 195C1101.55 195 1102 195.448 1102 196V332C1102 332.086 1101.99 332.17 1101.97
           332.25C1101.99 332.33 1102 332.414 1102 332.5C1102 333.052 1101.55 333.5 1101
           333.5H630C629.448 333.5 629 333.052 629 332.5C629 332.414 629.012 332.33 629.032
           332.25C629.012 332.17 629 332.086 629 332V257C629 256.448 629.448 256 630
           256H651V251.227L661 257L651 262.773V258H631V331.5H1100V197H1061C1060.45 197
           1060 196.552 1060 196C1060 195.448 1060.45 195 1061 195H1101Z"
      />
      <use href="#acc-alu" class="circuit-wire"/>
      <path
        id="ir-mux"
        d="M314 181L304 186.773V182H271V241C271 241.099 270.985 241.197 270.956 241.292C270.952
       241.306 270.946 241.319 270.942 241.332C270.894 241.469 270.817 241.598 270.707 241.707L256.707
       255.708C256.512 255.903 256.256 256.001 256 256.001L241 256C240.448 256 240 255.552 240 255C240
       254.448 240.448 254 241 254H255.587L269 240.586V181L269.005 180.897C269.015 180.799 269.039 180.705
       269.076 180.617C269.08 180.607 269.084 180.598 269.088 180.588C269.097 180.568 269.107 180.549 269.117
       180.53C269.122 180.52 269.128 180.509 269.134 180.499C269.144 180.482 269.154 180.466 269.164 180.45C269.17
       180.442 269.175 180.434 269.18 180.427C269.193 180.408 269.207 180.39 269.221 180.372C269.228 180.364 269.235
       180.356 269.243 180.348C269.255 180.333 269.268 180.319 269.282 180.305C269.289 180.297 269.297 180.29 269.305
       180.282C269.319 180.268 269.334 180.254 269.349 180.241C269.358 180.233 269.368 180.225 269.377 180.217C269.392
       180.205 269.406 180.195 269.421 180.185C269.432 180.177 269.443 180.169 269.454 180.162C269.474 180.15 269.493
       180.138 269.513 180.127C269.518 180.124 269.523 180.121 269.528 180.118C269.546 180.108 269.565 180.099 269.583
       180.091C269.597 180.084 269.611 180.078 269.625 180.072C269.637 180.068 269.648 180.064 269.66 180.06C269.678
       180.053 269.696 180.047 269.715 180.041C269.717 180.041 269.718 180.041 269.72 180.04L269.798 180.021L269.8
       180.02C269.819 180.016 269.838 180.013 269.857 180.011C269.904 180.004 269.952 180 270 180H304V175.227L314
       181Z"
      />
      <use href="#ir-mux" class="circuit-wire"/>
      <path
        id="ir-control"
        d="M270 254C270.552 254 271 254.448 271 255V411H303V406.227L313 412L303 417.773V413H270C269.448
           413 269 412.552 269 412V256H241C240.448 256 240 255.552 240 255C240 254.448 240.448 254 241 254H270Z"
      />
      <use href="#ir-control" class="circuit-wire"/>
      <path
        id="ir-mux-addr"
        d="M29 152L19 157.773V153H2V369H257.586L269 357.586V256H241C240.448 256 240 255.552 240 255C240 254.448
           240.448 254 241 254H270C270.552 254 271 254.448 271 255V358C271 358.155 270.963 358.302 270.9
           358.433C270.894 358.447 270.886 358.461 270.879 358.475C270.851 358.526 270.818 358.575 270.782
           358.62C270.759 358.65 270.734 358.68 270.707 358.707L258.707 370.707C258.659 370.755 258.606 370.798
           258.55 370.835C258.512 370.86 258.473 370.881 258.433 370.9C258.387 370.922 258.341 370.941 258.292
           370.956C258.272 370.962 258.251 370.967 258.23 370.972C258.219 370.974 258.208 370.977 258.196
           370.979C258.186 370.982 258.175 370.983 258.165 370.984C258.111 370.993 258.056 371 258 371H1C0.447715
           371 0 370.552 0 370V152C0 151.448 0.447716 151 1 151H19V146.227L29 152Z"
      />
      <use href="#ir-mux-addr" class="circuit-wire"/>
      <path
        id="internal-control"
        d="M1071 413C1071.55 413 1072 412.552 1072 412C1072 411.448 1071.55 411 1071 411V413ZM888
           412L898 417.774V406.226L888 412ZM1071 412V411H897V412V413H1071V412Z"
      />
      <use href="#internal-control" class="circuit-wire"/>

      {/* === Bus labels === */}
      <Bus x={245} y={127.5} number={8}/>
      <Bus x={280} y={172} number={8} />
      <Bus x={230} y={360} number={8} />
      <Bus x={280} y={402.5} number={16} />
      <Bus x={525} y={164.5} number={16}/>
      <Bus x={625} y={164.5} number={16}/>
      <Bus x={740} y={207} number={16}/>
      <Bus x={1075} y={187} number={16}/>

      {/* === Active wire overlays === */}
      <use href="#pc-mux" class={fetch() ? "fill-red-500" : ""} />
      <use href="#mux-mem" class={fetch() || load() || store() || alu() ? "fill-red-500" : ""} />
      <use href="#mem-ir" class={fetch() ? "fill-red-500" : ""} />
      <use href="#ir-control" class={decode() ? "fill-red-500" : ""} />
      <use href="#mem-mux" class={load() ? "fill-red-500" : ""} />
      <use href="#mux-acc" class={load() || alu() ? "fill-red-500" : ""} />
      <use href="#ir-mux" class={load() || store() || alu() ? "fill-red-500" : ""} />
      <use href="#acc-mem" class={store() ? "fill-red-500" : ""} />
      <use href="#mem-alu" class={alu() ? "fill-red-500" : ""} />
      <use href="#acc-alu" class={alu() ? "fill-red-500" : ""} />
      <use href="#alu-mux" class={alu() ? "fill-red-500" : ""} />
      <use href="#ir-mux-addr" class={branching() ? "fill-red-500" : ""} />
      <use href="#mux-pc" class={branching() || inc() ? "fill-red-500" : ""} />
      <use href="#inc" class={inc() ? "fill-red-500" : ""} />
      <use href="#acc-control" class={decode() ? "fill-red-500" : ""} />
      <use href="#internal-control" class={decode() ? "fill-red-500" : ""} />

      {/* === Components === */}
      <Multiplexer x={27} y={90} name="sel_jump_pc" isActivated={branching() || inc()} />
      <Multiplexer x={313} y={115} name="sel_mem_addr" isActivated={fetch() || load() || store() || alu()} />
      <Multiplexer x={815} y={150} name="sel_acc_data" isActivated={load() || alu()} />

      <ALU x={660} y={140} isActivated={alu()} />

      <ObscureMemory name="Mémoire" controlName="wr_mem" class="fill-amber-200" x={422.5} y={40} hasControlSignal={true} isWritable={store()}>
        <text x="5" y="82.5" dominant-baseline="middle" fill="black">data_in</text>
        <text x="5" y="222" dominant-baseline="middle" fill="black">addr</text>
        <text x="165" y="243" text-anchor="end" dominant-baseline="middle" fill="black">data_out</text>
      </ObscureMemory>

      <RegisterBox name="PC" number={pcVal()} class="bg-blue-600/20 border border-blue-500 reg-bg-blue reg-text-blue" x={120} y={100} isActivated={inc() || branching()} registerSize={REGISTER_8_BIT} />
      <RegisterBox name="IR" number={irVal()} class="bg-purple-600/20 border border-purple-500 reg-bg-purple reg-text-purple" x={120} y={220} isActivated={fetch()} />
      <RegisterBox name="ACC" number={accVal()} class="bg-emerald-600/20 border border-emerald-500 reg-bg-emerald reg-text-emerald" x={940} y={160} defaultIsBase10={true} isActivated={load() || alu()} />

      {/* === Junction dots === */}
      <circle cx="277" cy="137" r="5" class={fetch() || inc() ? "fill-red-500" : "fill-main-600"} />
      <circle cx="1101" cy="333" r="5" class={alu() || decode() ? "fill-red-500" : "fill-main-600"} />
      <circle cx="588" cy="174" r="5" class={fetch() || load() || alu() ? "fill-red-500" : "fill-main-600"} />
      <circle cx="1101" cy="196" r="5" class={store() || alu() || decode() ? "fill-red-500" : "fill-main-600"} />

      {/* +1 incrementer box */}
      <g>
        <rect x="119.5" y="48.5" width="39" height="39" rx="4" class="circuit-box-bg" stroke="#475569" stroke-width="2" />
        <text x="139" y="68" text-anchor="middle" dominant-baseline="middle" class="text-xl" class="circuit-label">+1</text>
      </g>

      {/* Control Signal box */}
      <g>
        <rect x="314.5" y="382.5" width="572" height="59" rx="4" class="circuit-box-bg" stroke="#475569" stroke-width="2"/>
        <text x="600.5" y="412" class="text-xl font-semibold" class="circuit-label" text-anchor="middle" dominant-baseline="middle">Control Signal</text>
      </g>

      <rect x="1071.5" y="382.5" width="59" height="59" rx="4" class="circuit-box-bg" stroke="#475569" stroke-width="2"/>
    </svg>
  );
}
