import styles from "./NavBar.module.css"
import HeartIcon from "@/assets/icons/heart-solid-full.svg?react"
import CartIcon from "@/assets/icons/cart-shopping-solid-full.svg?react"
import ProfileIcon from "@/assets/icons/circle-user-solid-full.svg?react"

import { Link } from "react-router-dom"

import Dropdown from "@/components/ui/Dropdown"

const navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link to={"/home"} className={styles.link}>
          <h2>ShopFlow</h2>
        </Link>
        <div className={styles.iconContainer}>
          <Dropdown>
              <Dropdown.Trigger asChild>
                {/* <ButtonStd variant='ghost' fullWidth>hej</ButtonStd> */}
                <a className={styles.iconBtn}><ProfileIcon className={styles.icon}/></a>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <button>Profile</button>
                <button>Settings</button>
                <button>Log out</button>
              </Dropdown.Content>
              
            </Dropdown>
          <a className={styles.iconBtn}><HeartIcon className={styles.icon}/></a>
          <a className={styles.iconBtn}><CartIcon className={styles.icon}/></a>
        </div>
      </div>
    </div>
  )
}

export default navbar