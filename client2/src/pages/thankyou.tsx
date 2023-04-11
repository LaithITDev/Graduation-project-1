import { Box, Heading, Text, Button, useColorMode } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Nav from '../components/NavBar';

const ThankYou = () => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'purple.50' : 'gray.800';
  
  return (
    <Box bg={bgColor} minHeight="100vh" display="flex" flexDirection="column">
      <meta name="description" content="Feedback page for NeuroNote" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Nav />
      <Box flex="1" display="flex" alignItems="center" justifyContent="center">
        <Box w="50%" textAlign="center" p={10} bg="white" boxShadow="md" borderRadius="md">
          <Heading as="h1" fontSize="6xl" mb={10} color="gray.800">Thank you for your input!</Heading>
          <Text fontSize="2xl" mb={10} color="gray.800">We appreciate your feedback.</Text>
          <Link to="/">
            <Button size='lg' colorScheme='purple' mb={10}>Return to Home</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default ThankYou;