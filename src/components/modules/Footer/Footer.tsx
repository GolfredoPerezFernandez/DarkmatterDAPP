import { Box } from '@chakra-ui/react';
import { Typography } from '@web3uikit/core';

const Footer = () => {
  return (
    <Box textAlign={'center'} marginTop={'40px'} flexDirection={'row'} w="full" p={6}>
      <Typography variant="H2">Copyright © 2022 DarkMatter. All Rights Reserved.</Typography>
    </Box>
  );
};

export default Footer;
