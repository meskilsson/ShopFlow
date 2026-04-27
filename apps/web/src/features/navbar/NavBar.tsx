import styles from "./NavBar.module.css"
import { Link } from "react-router-dom"
import HeartIcon from "@/assets/icons/heart-solid-full.svg?react"
import CartIcon from "@/assets/icons/cart-shopping-solid-full.svg?react"
import ProfileIcon from "@/assets/icons/circle-user-solid-full.svg?react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

import Dropdown from "@/components/UI/Dropdown"

const navbar = () => {

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return isAuthenticated ? (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link to={"/home"} className={styles.link}>
          <h2>ShopFlow</h2>
        </Link>
        <div className={styles.iconContainer}>
          <Dropdown>
            <Dropdown.Trigger asChild>
              {/* <ButtonStd variant='ghost' fullWidth>hej</ButtonStd> */}
              <a className={styles.iconBtn}><ProfileIcon className={styles.icon} /></a>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <button>Profile</button>
              <button>Settings</button>
              <button onClick={logout}
              >Log out</button>
            </Dropdown.Content>

          </Dropdown>
          <a className={styles.iconBtn}><HeartIcon className={styles.icon} /></a>
          <Link to="/cart" className={styles.iconBtn}>
            <CartIcon className={styles.icon} />
          </Link>


        </div>
      </div>
    </div>
  ) : <div className={styles.navbar}>
    <div className={styles.container}>
      <Link to={"/home"} className={styles.link}>
        <h2>ShopFlow</h2>
      </Link>
      <div className={styles.iconContainer}>
        <Dropdown>
          <Dropdown.Trigger asChild>
            {/* <ButtonStd variant='ghost' fullWidth>hej</ButtonStd> */}
            <a className={styles.iconBtn}><ProfileIcon className={styles.icon} /></a>
          </Dropdown.Trigger>

          <Dropdown.Content>

            <button
              onClick={() => navigate("/login")}
            >Log in</button>
          </Dropdown.Content>

        </Dropdown>
        <a className={styles.iconBtn}><HeartIcon className={styles.icon} /></a>
        <a className={styles.iconBtn}><CartIcon className={styles.icon} /></a>
      </div>
    </div>
  </div>
}

export default navbar
