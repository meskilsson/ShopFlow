import React from 'react'

interface NavSpacerProps {
    size: string // Rem
}

const NavSpacer = ({size}: NavSpacerProps) => {

    const styles: React.CSSProperties = {
        height: size,
        width: size
    }

  return (
    <div style={styles}></div>
  )
}

export default NavSpacer