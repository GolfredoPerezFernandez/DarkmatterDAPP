import { Grid, Text } from '@chakra-ui/react';

const Market = (props: any) => {
  return (
    <Grid
      h={props.height}
      justifyContent={'center'}
      alignItems="center"
      width={props.width}
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={4}
    >
      <Text fontSize="6xl" textAlign={'center'}>
        Under Construction
      </Text>
    </Grid>
  );
};

export default Market;
