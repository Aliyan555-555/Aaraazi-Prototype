import svgPaths from "./svg-prc0j4dtfw";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pc71600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.25 1.75V12.25" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p9d4f800} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[6.75px] shrink-0 size-[31.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[21px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g clipPath="url(#clip0_35116_2061)" id="Icon">
          <path d={svgPaths.p2f5dc600} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p2ca58180} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.pfc62e00} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M8.75 5.25H12.25" id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M8.75 8.75H12.25" id="Vector_5" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M8.75 12.25H12.25" id="Vector_6" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M8.75 15.75H12.25" id="Vector_7" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_35116_2061">
            <rect fill="white" height="21" width="21" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[24.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Bold',sans-serif] font-bold leading-[24.5px] relative shrink-0 text-[#101828] text-[17.5px] text-nowrap">aaraazi</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-[86px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="basis-0 bg-[#dcfce7] grow h-[19.5px] min-h-px min-w-px relative rounded-[6.75px] shrink-0" data-name="Badge">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] py-[2.75px] relative size-full">
          <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#016630] text-[10.5px] text-nowrap">Agency Manager</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
    </div>
  );
}

function Badge1() {
  return (
    <div className="bg-[#dbeafe] h-[19.5px] relative rounded-[6.75px] shrink-0 w-[91px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip px-[8px] py-[2.75px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#1447e6] text-[10.5px] text-nowrap">Agency Module</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 grow h-[19.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <Badge />
        <Badge1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-[340.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[14px] items-center relative size-full">
        <Button />
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 bg-[#ececf0] grow h-[28px] min-h-px min-w-px relative rounded-[3.35544e+07px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">SA</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-0 overflow-clip rounded-[3.35544e+07px] size-[28px] top-0" data-name="Primitive.span">
      <Text1 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute left-[45.5px] rounded-[3.35544e+07px] size-[28px] top-[1.75px]" data-name="Button">
      <PrimitiveSpan />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[8.75px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p1cc4b700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p33c82000} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute left-0 rounded-[6.75px] size-[31.5px] top-0" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-[73.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[31.5px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="bg-white h-[60.5px] relative shrink-0 w-full" data-name="Navigation">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pt-[14px] px-[21px] relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[50.19px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p317fdd80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2f54f800} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p11e2cd80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p31c78b80} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#030213] h-[31.5px] left-[14px] rounded-[6.75px] top-[14px] w-[181px]" data-name="Button">
      <Icon3 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[104.69px] text-[12.25px] text-center text-nowrap text-white top-[5px] translate-x-[-50%]">Add Lead</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[10.5px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p16dcb0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p29a9aa00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p9f2bd80} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p13c0200} id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[42px] top-[7px] w-[60.359px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Dashboard</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[31.5px] left-[7px] rounded-[6.75px] top-[66.5px] w-[195px]" data-name="Button">
      <Icon4 />
      <Text2 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 5.83333H7.00583" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 8.16667H7.00583" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5H7.00583" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 5.83333H9.33917" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 8.16667H9.33917" id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 3.5H9.33917" id="Vector_6" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 5.83333H4.6725" id="Vector_7" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 8.16667H4.6725" id="Vector_8" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4.66667 3.5H4.6725" id="Vector_9" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3c1c9800} id="Vector_10" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p162a1600} id="Vector_11" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[14px] relative shrink-0 w-[131.766px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap tracking-[0.2625px] uppercase">Property Management</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-0 pl-[10.5px] pr-0 py-0 top-0 w-[195px]" data-name="Container">
      <Icon5 />
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[57.094px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#1447e6] text-[12.25px] text-center text-nowrap">Properties</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#eff6ff] h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text4 />
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button5 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[57.453px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Sell Cycles</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text5 />
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button6 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[87.672px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Purchase Cycles</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text6 />
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button7 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[63.25px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Rent Cycles</p>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text7 />
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button8 />
    </div>
  );
}

function List() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.75px] h-[131.25px] items-start left-0 pl-[21px] pr-0 py-0 top-[28px] w-[195px]" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[159.25px] relative shrink-0 w-full" data-name="List Item">
      <Container5 />
      <List />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2f209b00} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[14px] relative shrink-0 w-[74px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap tracking-[0.2625px] uppercase">Deal Pipeline</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-0 pl-[10.5px] pr-0 py-0 top-0 w-[195px]" data-name="Container">
      <Icon6 />
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[102.344px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Deal Management</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text9 />
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[111.781px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Buyer Requirements</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text10 />
    </div>
  );
}

function ListItem6() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button10 />
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[105.453px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Rent Requirements</p>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text11 />
    </div>
  );
}

function ListItem7() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button11 />
    </div>
  );
}

function List1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.75px] h-[98px] items-start left-0 pl-[21px] pr-0 py-0 top-[28px] w-[195px]" data-name="List">
      <ListItem5 />
      <ListItem6 />
      <ListItem7 />
    </div>
  );
}

function ListItem8() {
  return (
    <div className="h-[126px] relative shrink-0 w-full" data-name="List Item">
      <Container6 />
      <List1 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p317fdd80} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p4b27f00} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pe97dd00} id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p31c78b80} id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[14px] relative shrink-0 w-[80.297px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap tracking-[0.2625px] uppercase">Relationships</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-0 pl-[10.5px] pr-0 py-0 top-0 w-[195px]" data-name="Container">
      <Icon7 />
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[31.563px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Leads</p>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text13 />
    </div>
  );
}

function ListItem9() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button12 />
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[26.563px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">CRM</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text14 />
    </div>
  );
}

function ListItem10() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button13 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[50.203px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Investors</p>
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text15 />
    </div>
  );
}

function ListItem11() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button14 />
    </div>
  );
}

function List2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.75px] h-[98px] items-start left-0 pl-[21px] pr-0 py-0 top-[28px] w-[195px]" data-name="List">
      <ListItem9 />
      <ListItem10 />
      <ListItem11 />
    </div>
  );
}

function ListItem12() {
  return (
    <div className="h-[126px] relative shrink-0 w-full" data-name="List Item">
      <Container7 />
      <List2 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M7 1.16667V12.8333" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p231c2b00} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="h-[14px] relative shrink-0 w-[134.609px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap tracking-[0.2625px] uppercase">{`Financials & Reporting`}</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-0 pl-[10.5px] pr-0 py-0 top-0 w-[195px]" data-name="Container">
      <Icon8 />
      <Text16 />
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[53.891px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Financials</p>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text17 />
    </div>
  );
}

function ListItem13() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button15 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[126.078px]" data-name="Text">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center">Portfolio Management</p>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text18 />
    </div>
  );
}

function ListItem14() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button16 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[70.797px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Performance</p>
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text19 />
    </div>
  );
}

function ListItem15() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button17 />
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[43.109px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Reports</p>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text20 />
    </div>
  );
}

function ListItem16() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="List Item">
      <Button18 />
    </div>
  );
}

function List3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[1.75px] h-[131.25px] items-start left-0 pl-[21px] pr-0 py-0 top-[28px] w-[195px]" data-name="List">
      <ListItem13 />
      <ListItem14 />
      <ListItem15 />
      <ListItem16 />
    </div>
  );
}

function ListItem17() {
  return (
    <div className="h-[159.25px] relative shrink-0 w-full" data-name="List Item">
      <Container8 />
      <List3 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[14px] relative shrink-0 w-[59.453px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap tracking-[0.2625px] uppercase">Resources</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24.5px] items-center left-0 pl-[10.5px] pr-0 py-0 top-0 w-[195px]" data-name="Container">
      <Icon9 />
      <Text21 />
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[14px] top-[7px] w-[63.234px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">Documents</p>
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute h-[31.5px] left-0 rounded-[6.75px] top-0 w-[174px]" data-name="Button">
      <Text22 />
    </div>
  );
}

function ListItem18() {
  return (
    <div className="absolute h-[31.5px] left-[21px] top-[28px] w-[174px]" data-name="List Item">
      <Button19 />
    </div>
  );
}

function ListItem19() {
  return (
    <div className="h-[59.5px] relative shrink-0 w-full" data-name="List Item">
      <Container9 />
      <ListItem18 />
    </div>
  );
}

function List4() {
  return (
    <div className="content-stretch flex flex-col gap-[10.5px] h-[672px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem4 />
      <ListItem8 />
      <ListItem12 />
      <ListItem17 />
      <ListItem19 />
    </div>
  );
}

function Navigation1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[694.5px] items-start left-0 overflow-clip pb-0 pt-[7px] px-[7px] top-[98px] w-[209px]" data-name="Navigation">
      <List4 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[10.5px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p29efa600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3042bc80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[42px] top-[7px] w-[71.297px]" data-name="Text">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center">Notifications</p>
    </div>
  );
}

function Button20() {
  return (
    <div className="h-[31.5px] relative rounded-[6.75px] shrink-0 w-full" data-name="Button">
      <Icon10 />
      <Text23 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[123.8px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[5px] translate-x-[-50%]">0</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col h-[46.5px] items-start left-0 pb-0 pt-[8px] px-[7px] top-[792.5px] w-[209px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Button20 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[10.5px]">Sarah Ahmed</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[10.5px]">Agency Manager</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[57px] items-start left-0 pb-0 pt-[15px] px-[14px] top-[839px] w-[209px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="bg-white h-[896px] relative shrink-0 w-[210px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button3 />
        <Button4 />
        <Navigation1 />
        <Container10 />
        <Container12 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2c0cbc0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.0833 7H2.91667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button21() {
  return (
    <div className="h-[28px] relative rounded-[6.75px] shrink-0 w-[31.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Button22() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-center text-nowrap">Dashboard</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function ListItem20() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[80.047px]" data-name="List Item">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <Button22 />
        <Icon12 />
      </div>
    </div>
  );
}

function Button23() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-center text-nowrap">Properties</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M5.25 10.5L8.75 7L5.25 3.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function ListItem21() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[75.891px]" data-name="List Item">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <Button23 />
        <Icon13 />
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#030213] text-[12.25px] text-nowrap">R-111 Block D, Naya Nazimabad</p>
      </div>
    </div>
  );
}

function ListItem22() {
  return (
    <div className="h-[17px] relative shrink-0 w-[200px]" data-name="List Item">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text24 />
      </div>
    </div>
  );
}

function NumberedList() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[344.453px]" data-name="Numbered List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <ListItem20 />
        <ListItem21 />
        <ListItem22 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10.5px] items-center relative size-full">
        <Button21 />
        <NumberedList />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.pde79d70} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.35%_8.35%_33.32%_33.32%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33352 9.33352">
            <path d={svgPaths.p2bd568f0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[25.31px] size-[14px] top-[8.75px]" data-name="PageHeader">
      <Icon14 />
    </div>
  );
}

function Button24() {
  return (
    <div className="bg-white h-[31.5px] relative rounded-[6.75px] shrink-0 w-[100px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PageHeader />
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[64.31px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[5px] translate-x-[-50%]">Edit</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_8.33%_45.83%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p282cab80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 7">
            <path d={svgPaths.p8b110c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PageHeader1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[14px] size-[14px] top-[8.75px]" data-name="PageHeader">
      <Icon15 />
    </div>
  );
}

function Button25() {
  return (
    <div className="basis-0 bg-[#030213] grow h-[31.5px] min-h-px min-w-px relative rounded-[6.75px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PageHeader1 />
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[83px] text-[12.25px] text-center text-nowrap text-white top-[5px] translate-x-[-50%]">Start Sell Cycle</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[8.75px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p173d3600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pe2f300} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p318aea00} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button26() {
  return (
    <div className="bg-white relative rounded-[6.75px] shrink-0 size-[31.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-[283.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center relative size-full">
        <Button24 />
        <Button25 />
        <Button26 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[59.5px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[21px] py-0 relative size-full">
          <Container14 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
        <g id="Icon">
          <path d={svgPaths.p2c9da500} id="Vector" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
          <path d={svgPaths.p1fff6f00} id="Vector_2" stroke="var(--stroke-0, #030213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[#f8f8f9] relative rounded-[8.75px] shrink-0 size-[35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[21px] relative shrink-0 w-[250px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#030213] text-[14px] text-nowrap top-[-1px]">R-111 Block D, Naya Nazimabad</p>
      </div>
    </div>
  );
}

function StatusBadge() {
  return (
    <div className="bg-[#dcfce7] h-[26.5px] relative rounded-[6.75px] shrink-0 w-[74.938px]" data-name="StatusBadge2">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9.75px] py-[2.75px] relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#016630] text-[14px] text-nowrap">Available</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[10.5px] h-[26.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading />
      <StatusBadge />
    </div>
  );
}

function Container19() {
  return (
    <div className="basis-0 grow h-[51px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[10.5px] h-[51px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[73px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[11.5px] px-[21px] relative size-full">
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="h-[21px] relative shrink-0 w-[29.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]">Price</p>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 12.8333">
            <path d="M0.583333 0.583333V12.25" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16667 9.33333">
            <path d={svgPaths.p30a1c680} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-center justify-between left-[10.5px] top-[10.5px] w-[207.188px]" data-name="Container">
      <Text25 />
      <Container22 />
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[10.5px] top-[38.5px] w-[53.578px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#030213] text-[21px] text-nowrap">PKR 0</p>
    </div>
  );
}

function MetricCard() {
  return (
    <div className="absolute bg-white border border-[#e5e7eb] border-solid h-[79px] left-0 rounded-[8.75px] top-0 w-[230.188px]" data-name="MetricCard">
      <Container23 />
      <Text26 />
    </div>
  );
}

function Text27() {
  return (
    <div className="h-[21px] relative shrink-0 w-[28.344px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]">Area</p>
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.pdf40b00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-center justify-between left-[10.5px] top-[10.5px] w-[207.203px]" data-name="Container">
      <Text27 />
      <Container24 />
    </div>
  );
}

function Text28() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[10.5px] top-[38.5px] w-[89.281px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#030213] text-[21px] text-nowrap">120 sq yd</p>
    </div>
  );
}

function MetricCard1() {
  return (
    <div className="absolute bg-white border border-[#e5e7eb] border-solid h-[79px] left-[244.19px] rounded-[8.75px] top-0 w-[230.203px]" data-name="MetricCard">
      <Container25 />
      <Text28 />
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[21px] relative shrink-0 w-[69.734px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]">Days Listed</p>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 0.583333V2.91667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 0.583333V2.91667" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.pdf40b00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 1.16667">
            <path d="M0.583333 0.583333H11.0833" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-center justify-between left-[10.5px] top-[10.5px] w-[207.203px]" data-name="Container">
      <Text29 />
      <Container26 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[10.5px] top-[38.5px] w-[11.328px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#030213] text-[21px] text-nowrap">1</p>
    </div>
  );
}

function MetricCard3() {
  return (
    <div className="absolute bg-white border border-[#e5e7eb] border-solid h-[79px] left-[488.39px] rounded-[8.75px] top-0 w-[230.203px]" data-name="MetricCard">
      <Container27 />
      <Text30 />
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[21px] relative shrink-0 w-[35.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]">Views</p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8339 9.33261">
            <path d={svgPaths.p3fcba280} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p22c75d80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-center justify-between left-[10.5px] top-[10.5px] w-[207.203px]" data-name="Container">
      <Text31 />
      <Container28 />
    </div>
  );
}

function Text32() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[10.5px] top-[38.5px] w-[11.328px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#030213] text-[21px] text-nowrap">0</p>
    </div>
  );
}

function MetricCard4() {
  return (
    <div className="absolute bg-white border border-[#e5e7eb] border-solid h-[79px] left-[732.59px] rounded-[8.75px] top-0 w-[230.203px]" data-name="MetricCard">
      <Container29 />
      <Text32 />
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[21px] relative shrink-0 w-[38.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1px]">Cycles</p>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 12.8333">
            <path d={svgPaths.p255b5a00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p16bde880} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 1.16667">
            <path d="M1.75 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 1.16667">
            <path d="M5.25 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 1.16667">
            <path d="M5.25 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-center justify-between left-[10.5px] top-[10.5px] w-[207.188px]" data-name="Container">
      <Text33 />
      <Container30 />
    </div>
  );
}

function Text34() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[10.5px] top-[38.5px] w-[11.328px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[#030213] text-[21px] text-nowrap">0</p>
    </div>
  );
}

function MetricCard5() {
  return (
    <div className="absolute bg-white border border-[#e5e7eb] border-solid h-[79px] left-[976.8px] rounded-[8.75px] top-0 w-[230.188px]" data-name="MetricCard">
      <Container31 />
      <Text34 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[79px] relative shrink-0 w-full" data-name="Container">
      <MetricCard />
      <MetricCard1 />
      <MetricCard3 />
      <MetricCard4 />
      <MetricCard5 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[15px] px-[21px] relative size-full">
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[61.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Connected:</p>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Icon">
          <path d={svgPaths.p1aaf0700} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          <path d={svgPaths.p323f3300} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#f9fafb] relative rounded-[3.5px] shrink-0 size-[17.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Text36() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#030213] text-[12.25px] text-nowrap">saad</p>
      </div>
    </div>
  );
}

function EntityChip() {
  return (
    <div className="h-[26.5px] relative rounded-[6.75px] shrink-0 w-[65.391px]" data-name="EntityChip">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7px] items-center px-[8px] py-px relative size-full">
        <Container34 />
        <Text36 />
      </div>
    </div>
  );
}

function ConnectedEntitiesBar() {
  return (
    <div className="bg-[#f8f8f9] h-[42.5px] relative shrink-0 w-full" data-name="ConnectedEntitiesBar">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[1px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[14px] items-center pl-[24px] pr-0 py-px relative size-full">
          <Text35 />
          <EntityChip />
        </div>
      </div>
    </div>
  );
}

function PageHeader2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[284px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1249px]" data-name="PageHeader">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Container21 />
      <Container33 />
      <ConnectedEntitiesBar />
    </div>
  );
}

function Icon24() {
  return (
    <div className="absolute left-[159.98px] size-[14px] top-[4.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2d995e80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1fbf6000} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute bg-white border border-[rgba(0,0,0,0)] border-solid h-[25.5px] left-[3px] rounded-[12.75px] top-[3.5px] w-[400.328px]" data-name="Primitive.button">
      <Icon24 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[212.23px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-px translate-x-[-50%]">Overview</p>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[159.63px] size-[14px] top-[4.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[25.5px] left-[403.33px] rounded-[12.75px] top-[3.5px] w-[400.328px]" data-name="Primitive.button">
      <Icon25 />
      <div className="absolute flex flex-col font-['Arimo:Regular',sans-serif] font-normal justify-center leading-[0] left-[211.88px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[10px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[17.5px]">Cycles (0)</p>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[165.83px] size-[14px] top-[4.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_35116_2080)" id="Icon">
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pc012c00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_35116_2080">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function PrimitiveButton2() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0)] border-solid h-[25.5px] left-[803.66px] rounded-[12.75px] top-[3.5px] w-[400.344px]" data-name="Primitive.button">
      <Icon26 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[212.58px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-px translate-x-[-50%]">History</p>
    </div>
  );
}

function TabList() {
  return (
    <div className="bg-[#ececf0] h-[31.5px] relative rounded-[12.75px] shrink-0 w-[1207px]" data-name="Tab List">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveButton />
        <PrimitiveButton1 />
        <PrimitiveButton2 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#101828] text-[12.25px] text-center text-nowrap">Property Listed</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[10.5px] text-center">Dec 27, 2025</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[10.5px] text-center">Initial listing</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[52.5px] items-start left-[53.55px] top-[38.5px] w-[81.313px]" data-name="Container">
      <Container35 />
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return <div className="absolute bg-[#00a63e] h-[3.5px] left-[94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Icon27() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon27 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[80.2px] p-[2px] rounded-[3.35544e+07px] size-[28px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#00a63e] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Text37 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[91px] left-0 top-0 w-[188.422px]" data-name="Container">
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#101828] text-[12.25px] text-center text-nowrap">Active Marketing</p>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[10.5px] text-center">Dec 27, 2025</p>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#6a7282] text-[10.5px] text-center">0 cycles created</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[52.5px] items-start left-[48.42px] top-[38.5px] w-[91.563px]" data-name="Container">
      <Container42 />
      <Container43 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return <div className="absolute bg-[#00a63e] h-[3.5px] left-[-94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Container47() {
  return <div className="absolute bg-[#00a63e] h-[3.5px] left-[94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Icon28() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text38() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon28 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[80.2px] p-[2px] rounded-[3.35544e+07px] size-[28px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#00a63e] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Text38 />
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute h-[91px] left-[188.42px] top-0 w-[188.422px]" data-name="Container">
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[52.84px] top-[38.5px] w-[82.734px]" data-name="Container">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#6a7282] text-[12.25px] text-center text-nowrap">Under Contract</p>
    </div>
  );
}

function Container51() {
  return <div className="absolute bg-[#00a63e] h-[3.5px] left-[-94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Container52() {
  return <div className="absolute bg-[#d1d5dc] h-[3.5px] left-[94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Icon29() {
  return (
    <div className="h-[10.5px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.625 9.625">
            <path d={svgPaths.p26bf4e40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon29 />
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[80.2px] p-[2px] rounded-[3.35544e+07px] size-[28px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Text39 />
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute h-[56px] left-[376.84px] top-0 w-[188.422px]" data-name="Container">
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-[35.75px] top-[38.5px] w-[116.906px]" data-name="Container">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#6a7282] text-[12.25px] text-center text-nowrap">Transaction Complete</p>
    </div>
  );
}

function Container56() {
  return <div className="absolute bg-[#d1d5dc] h-[3.5px] left-[-94.2px] top-[12.25px] w-[188.422px]" data-name="Container" />;
}

function Icon30() {
  return (
    <div className="h-[10.5px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.625 9.625">
            <path d={svgPaths.p26bf4e40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text40() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon30 />
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[80.2px] p-[2px] rounded-[3.35544e+07px] size-[28px] top-0" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[3.35544e+07px]" />
      <Text40 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute h-[56px] left-[565.27px] top-0 w-[188.422px]" data-name="Container">
      <Container55 />
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[91px] relative shrink-0 w-full" data-name="Container">
      <Container41 />
      <Container49 />
      <Container54 />
      <Container58 />
    </div>
  );
}

function StatusTimeline() {
  return (
    <div className="bg-white h-[135px] relative rounded-[8.75px] shrink-0 w-full" data-name="StatusTimeline">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-px pt-[22px] px-[22px] relative size-full">
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function ImageR111BlockDNayaNazimabad() {
  return <div className="h-[222px] shrink-0 w-full" data-name="Image (R-111 Block D, Naya Nazimabad)" />;
}

function Container60() {
  return (
    <div className="bg-[#e5e7eb] h-[224px] relative rounded-[8.75px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-px relative size-full">
          <ImageR111BlockDNayaNazimabad />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#030213] text-[14px] text-nowrap top-[-1px]">Primary Information</p>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43px] items-start left-px pb-px pt-[10.5px] px-[21px] top-px w-[795.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Heading1 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 21.9998">
            <path d={svgPaths.p38611800} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_37.5%_45.83%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d={svgPaths.p1e531d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text41() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Text42() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[43.391px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Address</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text41 />
      <Text42 />
    </div>
  );
}

function Container63() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">R-111 Block D, Naya Nazimabad</p>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_35116_2161)" id="Icon">
          <path d={svgPaths.pce65a00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p31b8ff80} id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_35116_2161">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button27() {
  return (
    <div className="relative rounded-[6.75px] shrink-0 size-[21px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon32 />
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex h-[21px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container63 />
      <Button27 />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[63.5px] items-start left-0 pb-px pt-[7px] px-0 top-0 w-[362.828px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container62 />
      <Container64 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[58.33%] left-1/2 right-[49.96%] top-[41.67%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/2 right-[49.96%] top-[58.33%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-1/2 right-[49.96%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_33.29%_58.33%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_33.29%_41.67%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.29%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_66.62%_58.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_66.62%_41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.62%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-1px_-9999.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.01 2">
            <path d="M1 1H1.01" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-[37.5%] right-[37.5%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-25%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d={svgPaths.p14718d00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
            <path d={svgPaths.p24eb100} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text43() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Text44() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[74.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Property Type</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24px] items-center left-0 top-[7px] w-[362.828px]" data-name="Container">
      <Text43 />
      <Text44 />
    </div>
  );
}

function PropertyDetail() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-[34.5px] w-[35.266px]" data-name="PropertyDetail">
      <p className="capitalize font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#030213] text-[12.25px] text-nowrap">house</p>
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid h-[63.5px] left-[390.83px] top-0 w-[362.828px]" data-name="Container">
      <Container66 />
      <PropertyDetail />
    </div>
  );
}

function Icon34() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 22">
            <path d="M1 1V21" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
            <path d={svgPaths.p30498f48} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text45() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Text46() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[26.156px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Price</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text45 />
      <Text46 />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">PKR 0</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[60px] items-start left-0 pb-px pt-[7px] px-0 top-[63.5px] w-[362.828px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container68 />
      <Container69 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p371e6400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text47() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Text48() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[24.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Area</p>
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text47 />
      <Text48 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">120 sq yd</p>
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[60px] items-start left-[390.83px] pb-px pt-[7px] px-0 top-[63.5px] w-[362.828px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container71 />
      <Container72 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_91.67%_16.67%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 18">
            <path d="M1 1V17" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[33.33%_8.33%_16.67%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 14">
            <path d={svgPaths.p3905cf80} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_8.33%_29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-1px_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 2">
            <path d="M1 1H21" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/4 right-3/4 top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 11">
            <path d="M1 1V10" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text49() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Text50() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[55.016px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Bedrooms</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text49 />
      <Text50 />
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">1</p>
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[60px] items-start left-0 pb-px pt-[7px] px-0 top-[123.5px] w-[362.828px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container74 />
      <Container75 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[58.33%] top-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d="M3 1L1 3" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_29.17%_12.5%_70.83%]" data-name="Vector">
        <div className="absolute inset-[-50%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M1 1V3" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[8.33%] right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-1px_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 2">
            <path d="M1 1H21" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_70.83%_12.5%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-50%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M1 1V3" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.48%_16.67%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18.0037">
            <path d={svgPaths.p5f17980} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text51() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Text52() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[58.703px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Bathrooms</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text51 />
      <Text52 />
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">1</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[60px] items-start left-[390.83px] pb-px pt-[7px] px-0 top-[123.5px] w-[362.828px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container77 />
      <Container78 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M1 1V5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p371e6400} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-1px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 2">
            <path d="M1 1H19" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text53() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Text54() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[95.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Construction Year</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text53 />
      <Text54 />
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">2020</p>
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[59px] items-start left-0 pb-0 pt-[7px] px-0 top-[183.5px] w-[362.828px]" data-name="Container">
      <Container80 />
      <Container81 />
    </div>
  );
}

function Text55() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-0 top-[7px] w-[32.781px]" data-name="Text">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Status</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute h-[19.5px] left-0 rounded-[6.75px] top-[28px] w-[59.078px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8px] py-[2.75px] relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#030213] text-[10.5px] text-nowrap">Available</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute h-[59px] left-[390.83px] top-[183.5px] w-[362.828px]" data-name="Container">
      <Text55 />
      <Badge2 />
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute h-[242.5px] left-[22px] top-[58px] w-[753.656px]" data-name="Container">
      <Container65 />
      <Container67 />
      <Container70 />
      <Container73 />
      <Container76 />
      <Container79 />
      <Container82 />
      <Container83 />
    </div>
  );
}

function InfoPanel() {
  return (
    <div className="bg-white h-[315.5px] relative rounded-[8.75px] shrink-0 w-full" data-name="InfoPanel">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <Container61 />
      <Container84 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#030213] text-[14px] text-nowrap top-[-1px]">People</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43px] items-start left-px pb-px pt-[10.5px] px-[21px] top-px w-[795.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Heading2 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_20.83%_12.5%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 8">
            <path d={svgPaths.p11b86180} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_33.33%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.pb08b100} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text56() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon39 />
      </div>
    </div>
  );
}

function Text57() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[79.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Current Owner</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute content-stretch flex gap-[7px] h-[24px] items-center left-0 top-[7px] w-[362.828px]" data-name="Container">
      <Text56 />
      <Text57 />
    </div>
  );
}

function Button28() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-0 top-[34.5px] w-[25.453px]" data-name="Button">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#030213] text-[12.25px] text-nowrap">saad</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[59px] left-[22px] top-[58px] w-[362.828px]" data-name="Container">
      <Container86 />
      <Button28 />
    </div>
  );
}

function InfoPanel1() {
  return (
    <div className="bg-white h-[132px] relative rounded-[8.75px] shrink-0 w-full" data-name="InfoPanel">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <Container85 />
      <Container87 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[21px] h-[940.75px] items-start left-0 top-0 w-[797.656px]" data-name="Container">
      <StatusTimeline />
      <Container60 />
      <InfoPanel />
      <InfoPanel1 />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[14px] left-[22px] top-[22px] w-[344.344px]" data-name="CardTitle">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[14px] left-0 text-[#0a0a0a] text-[14px] text-nowrap top-[-2px]">Quick Actions</p>
    </div>
  );
}

function Icon40() {
  return (
    <div className="absolute left-[11.5px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3471a100} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1977ee80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button29() {
  return (
    <div className="bg-white h-[31.5px] relative rounded-[6.75px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <Icon40 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[73.5px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[5px] translate-x-[-50%]">Start Sell Cycle</p>
    </div>
  );
}

function Icon41() {
  return (
    <div className="absolute left-[11.5px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_35116_1990)" id="Icon">
          <path d={svgPaths.p254bff00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p2b33ed80} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p272f7980} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_35116_1990">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button30() {
  return (
    <div className="bg-white h-[31.5px] relative rounded-[6.75px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <Icon41 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[88.5px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[5px] translate-x-[-50%]">Start Purchase Cycle</p>
    </div>
  );
}

function Icon42() {
  return (
    <div className="absolute left-[11.5px] size-[14px] top-[8.75px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2d995e80} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1fbf6000} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button31() {
  return (
    <div className="bg-white h-[31.5px] relative rounded-[6.75px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
      <Icon42 />
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] left-[76.5px] text-[#0a0a0a] text-[12.25px] text-center text-nowrap top-[5px] translate-x-[-50%]">Start Rent Cycle</p>
    </div>
  );
}

function CardContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7px] h-[129.5px] items-start left-px px-[21px] py-0 top-[62.25px] w-[386.344px]" data-name="CardContent">
      <Button29 />
      <Button30 />
      <Button31 />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[192.75px] relative rounded-[12.75px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[12.75px]" />
      <CardTitle />
      <CardContent />
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[84.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Days on Market</p>
      </div>
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 6V12L16 14" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pace200} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container90() {
  return (
    <div className="bg-[#dbeafe] relative rounded-[8.75px] shrink-0 size-[35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon43 />
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex h-[35px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container89 />
      <Container90 />
    </div>
  );
}

function Container92() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[31.5px] left-0 text-[#030213] text-[26.25px] text-nowrap top-[-3px]">1</p>
    </div>
  );
}

function Icon44() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Icon">
          <path d="M2.1875 5.25H8.3125" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Text58() {
  return (
    <div className="basis-0 grow h-[14px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[14px] min-h-px min-w-px relative shrink-0 text-[#4a5565] text-[10.5px]">Normal</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="bg-[#f9fafb] h-[17.5px] relative rounded-[3.35544e+07px] shrink-0 w-[63.75px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.5px] items-center px-[7px] py-0 relative size-full">
        <Icon44 />
        <Text58 />
      </div>
    </div>
  );
}

function Text59() {
  return (
    <div className="h-[14px] relative shrink-0 w-[53.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#6a7282] text-[10.5px] text-nowrap">since listing</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex gap-[7px] h-[17.5px] items-center relative shrink-0 w-full" data-name="Container">
      <Container93 />
      <Text59 />
    </div>
  );
}

function MetricCard2() {
  return (
    <div className="bg-white h-[149px] relative rounded-[8.75px] shrink-0 w-full" data-name="MetricCard2">
      <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[14px] items-start pb-px pt-[22px] px-[22px] relative size-full">
          <Container91 />
          <Container92 />
          <Container94 />
        </div>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[60.141px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Total Views</p>
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3c563480} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3cccb600} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container96() {
  return (
    <div className="bg-[#f3f4f6] relative rounded-[8.75px] shrink-0 size-[35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon45 />
      </div>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute content-stretch flex h-[35px] items-start justify-between left-[22px] top-[22px] w-[344.344px]" data-name="Container">
      <Container95 />
      <Container96 />
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute h-[31.5px] left-[22px] top-[71px] w-[344.344px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[31.5px] left-0 text-[#030213] text-[26.25px] text-nowrap top-[-3px]">0</p>
    </div>
  );
}

function Icon46() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Icon">
          <path d="M2.1875 5.25H8.3125" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.875" />
        </g>
      </svg>
    </div>
  );
}

function Text60() {
  return (
    <div className="basis-0 grow h-[14px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#4a5565] text-[10.5px] text-nowrap">0%</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex gap-[3.5px] h-[17.5px] items-center left-[22px] px-[7px] py-0 rounded-[3.35544e+07px] top-[109.5px] w-[42.656px]" data-name="Container">
      <Icon46 />
      <Text60 />
    </div>
  );
}

function MetricCard6() {
  return (
    <div className="bg-white h-[149px] relative rounded-[8.75px] shrink-0 w-full" data-name="MetricCard2">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <Container97 />
      <Container98 />
      <Container99 />
    </div>
  );
}

function Container100() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[62.859px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Total Cycles</p>
      </div>
    </div>
  );
}

function Icon47() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.pb47f400} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p17a13100} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M10 9H8" id="Vector_3" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 13H8" id="Vector_4" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M16 17H8" id="Vector_5" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container101() {
  return (
    <div className="bg-[#dcfce7] relative rounded-[8.75px] shrink-0 size-[35px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon47 />
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex h-[35px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container100 />
      <Container101 />
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[31.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[31.5px] left-0 text-[#030213] text-[26.25px] text-nowrap top-[-3px]">0</p>
    </div>
  );
}

function MetricCard7() {
  return (
    <div className="bg-white h-[131.5px] relative rounded-[8.75px] shrink-0 w-full" data-name="MetricCard2">
      <div aria-hidden="true" className="absolute border border-[#b9f8cf] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[14px] items-start pb-px pt-[22px] px-[22px] relative size-full">
          <Container102 />
          <Container103 />
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#030213] text-[14px] text-nowrap top-[-1px]">Cycle Breakdown</p>
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43px] items-start left-px pb-px pt-[10.5px] px-[21px] top-px w-[386.344px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Heading3 />
    </div>
  );
}

function Icon48() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[29.17%_8.33%_45.83%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
            <path d="M1 1H7V7" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
            <path d="M21 1L12.5 9.5L7.5 4.5L1 11" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text61() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon48 />
      </div>
    </div>
  );
}

function Text62() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[55.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Sell Cycles</p>
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text61 />
      <Text62 />
    </div>
  );
}

function Container106() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">0</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[56.5px] items-start left-0 pb-px pt-[5.25px] px-0 top-0 w-[344.344px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container105 />
      <Container106 />
    </div>
  );
}

function Icon49() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[83.33%_62.5%_8.33%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d={svgPaths.p32cd9cf0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-3/4 right-[16.67%] top-[83.33%]" data-name="Vector">
        <div className="absolute inset-[-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
            <path d={svgPaths.p32cd9cf0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.54%_7.96%_33.12%_8.54%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-4.99%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.04 16.0005">
            <path d={svgPaths.p8d29680} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text63() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon49 />
      </div>
    </div>
  );
}

function Text64() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[85.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Purchase Cycles</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text63 />
      <Text64 />
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">0</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[56.5px] items-start left-0 pb-px pt-[5.25px] px-0 top-[56.5px] w-[344.344px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f3f4f6] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Container108 />
      <Container109 />
    </div>
  );
}

function Icon50() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[12.5%] left-[37.5%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-11.11%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 11">
            <path d={svgPaths.p3ff7f900} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.26%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.0005">
            <path d={svgPaths.pce35280} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text65() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon50 />
      </div>
    </div>
  );
}

function Text66() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[61.563px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px] text-nowrap">Rent Cycles</p>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="content-stretch flex gap-[7px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Text65 />
      <Text66 />
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Arimo:Regular',sans-serif] font-normal grow leading-[17.5px] min-h-px min-w-px relative shrink-0 text-[#030213] text-[12.25px]">0</p>
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.5px] h-[55.5px] items-start left-0 pb-0 pt-[5.25px] px-0 top-[113px] w-[344.344px]" data-name="Container">
      <Container111 />
      <Container112 />
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute h-[168.5px] left-[22px] top-[54.5px] w-[344.344px]" data-name="Container">
      <Container107 />
      <Container110 />
      <Container113 />
    </div>
  );
}

function InfoPanel2() {
  return (
    <div className="bg-white h-[234.5px] relative rounded-[8.75px] shrink-0 w-full" data-name="InfoPanel">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <Container104 />
      <Container114 />
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[21px] h-[940.75px] items-start left-[818.66px] top-0 w-[388.344px]" data-name="Container">
      <Card />
      <MetricCard2 />
      <MetricCard6 />
      <MetricCard7 />
      <InfoPanel2 />
    </div>
  );
}

function PropertyDetail1() {
  return (
    <div className="h-[940.75px] relative shrink-0 w-[1207px]" data-name="PropertyDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container88 />
        <Container115 />
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] h-[1021.25px] items-start left-[21px] top-[305px] w-[1207px]" data-name="Primitive.div">
      <TabList />
      <PropertyDetail1 />
    </div>
  );
}

function PropertyDetail2() {
  return (
    <div className="basis-0 bg-[#f9fafb] grow h-[1347.25px] min-h-px min-w-px relative shrink-0" data-name="PropertyDetail">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PageHeader2 />
        <PrimitiveDiv />
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="content-stretch flex h-[1347.25px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <PropertyDetail2 />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-[#f9fafb] content-stretch flex flex-col h-[1407.75px] items-start left-0 top-0 w-[1459px]" data-name="App">
      <Navigation />
      <Container116 />
    </div>
  );
}

function PageHeader3() {
  return (
    <div className="absolute content-stretch flex items-start left-[1421.75px] overflow-clip size-px top-[89.75px]" data-name="PageHeader">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#0a0a0a] text-[12.25px] text-center text-nowrap">More actions</p>
    </div>
  );
}

export default function PropertiesDetailsPage() {
  return (
    <div className="bg-white relative size-full" data-name="Properties details page">
      <App />
      <PageHeader3 />
    </div>
  );
}