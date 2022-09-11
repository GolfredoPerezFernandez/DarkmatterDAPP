/_ eslint @typescript-eslint/no-var-requires: "off" _/
import { Stack ,Box,Image} from "@chakra-ui/react";
import { Avatar, Button, PlanCard } from "@web3uikit/core";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

export default function CarouselView({
profile,
home,
isBlockchain,
blockchain,
}: any): JSX.Element {
const [eventsAdvertisingRender, setEventsAdvertisingRender] = useState([]);

const responsive = {
superLargeDesktop: {
// the naming can be any, depends on you.
breakpoint: { max: 4000, min: 3000 },
items: 5,
},
desktop: {
breakpoint: { max: 3000, min: 1024 },
items: 3,
},
tablet: {
breakpoint: { max: 1024, min: 464 },
items: 2,
},
mobile: {
breakpoint: { max: 464, min: 0 },
items: 1,
},
};
let eventsAdvertisingRenderRandom1 = eventsAdvertisingRender
.map(value => ({ value, sort: Math.random() }))
.sort((a, b) => a.sort - b.sort)
.map(({ value }) => value)
.slice(0, 12)

    let eventsAdvertisingRenderRandom2 = eventsAdvertisingRender
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 12)

return (
<Stack sx={{ mt: 1 }}>
<PlanCard
description={[
'Gain 2% of Marketplace fees',
'DAO Voting',
'Nft Staking',
'Exclusive Content',
'Community Support',
'AirDrops',
]}
descriptionTitle="Enjoy its exclusive benefits today!"
footer={
<Button
customize={{ backgroundColor: '#000228', textColor: 'white' }}
isFullWidth
text="Mint Cost 4400 $DM"
theme="custom"
/>
}
isActive
subTitle="DAO"
title={
<h1 style={{ color: '#041836', fontSize: '34px' }}>
<strong>Members </strong>
<Box
style={{
                      marginTop: 10,
                      marginBottom: 10,
                      width: '100%',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }} >
<Avatar
                      image="https://cootiesv2.mypinata.cloud/ipfs/QmXpXkZVWDE26o14rs3FJht78TNvVopWG7xQoCCZy24EX2"
                      isRounded
                      size={140}
                      theme="image"
                    />
</Box>
</h1>
}
isCurrentPlan={false}
/>
<Carousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay
        autoPlaySpeed={1}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        customTransition="all 1s linear"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        showDots={false}
        sliderClass=""
        slidesToSlide={0}
        swipeable
        transitionDuration={6000}
        rtl={false}
      >
{eventsAdvertisingRenderRandom1.map((event: any) => {
return (
<Box key={event.id} sx={{ mx: 1, my: 1 }}>

              <Image

             width={"200px"}
             height={"200px"}
                src={event.attributes.eventImg}
              />
            </Box>
          );
        })}
      </Carousel>

      <Carousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay
        autoPlaySpeed={1}
        centerMode={false}
        className=""
        containerClass="container-with-dots"
        customTransition="all 1s linear"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        showDots={false}
        sliderClass=""
        slidesToSlide={0}
        swipeable
        transitionDuration={6000}
        rtl={true}
      >
        {eventsAdvertisingRenderRandom2.map((event: any) => {
          return (
            <Box key={event.id} sx={{ mx: 1, my: 1 }}>
             <Image
             width={"200px"}
             height={"200px"}
                src={event.attributes.eventImg}
              />
            </Box>
          );
        })}
      </Carousel>
    </Stack>

);
}
