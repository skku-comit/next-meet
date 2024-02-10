import React from 'react';
import {useMediaQuery} from 'react-responsive';

export const Mobile = ({children}:any) => {
  const isMobile = useMediaQuery({
    query : "(max-width:768px)"
  });
  
  return <>{isMobile && children}</>
}

export const PC = ({children}:any) => {
  const isPc = useMediaQuery({
    query : "(min-width:769px)"
  });
  
  return <>{isPc && children}</>
}