import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";

import HeartIcon from "@/assets/icons/heart-solid-full.svg?react";
import CartIcon from "@/assets/icons/cart-shopping-solid-full.svg?react";
import ProfileIcon from "@/assets/icons/circle-user-solid-full.svg?react";

import { useAuth } from "@/contexts/AuthContext";
import Dropdown from "@/components/UI/Dropdown";
import { useEffect, useState } from "react";
import { getWishlist } from "@/api/wishlist";

const NavBar = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAuthenticated) {
      getWishlist()
        .then((data) => setWishlistCount(data.length))
        .catch(() => setWishlistCount(0));
    } else {
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const WishlistIcon = (
    <Link
      to="/wishlist"
      className={styles.iconBtn}
      style={{ position: "relative" }}
    >
      <HeartIcon className={styles.icon} />
      {wishlistCount > 0 && (
        <span className={styles.wishlistCount}>{wishlistCount}</span>
      )}
    </Link>
  );

  if (isAdmin && isAuthenticated) {
    return (
      <div className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/home" className={styles.link}>
            <h2>ShopFlow</h2>
          </Link>

          <div className={styles.iconContainer}>
            <Dropdown>
              <Dropdown.Trigger asChild>
                <a className={styles.iconBtn}>
                  <ProfileIcon className={styles.icon} />
                </a>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/profile/settings")}>
                  Settings
                </button>
                <button onClick={logout}>Log out</button>
              </Dropdown.Content>
            </Dropdown>

            {WishlistIcon}

            <Link to="/cart" className={styles.iconBtn}>
              <CartIcon className={styles.icon} />
            </Link>

            <Link to="/admin" className={styles.iconBtn}>
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/home" className={styles.link}>
          <h2>ShopFlow</h2>
        </Link>

        <div className={styles.iconContainer}>
          <Dropdown>
            <Dropdown.Trigger asChild>
              <a className={styles.iconBtn}>
                <ProfileIcon className={styles.icon} />
              </a>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <button onClick={() => navigate("/profile")}>Profile</button>
              <button onClick={() => navigate("/profile/settings")}>
                Settings
              </button>
              <button onClick={logout}>Log out</button>
            </Dropdown.Content>
          </Dropdown>

          {WishlistIcon}

          <Link to="/cart" className={styles.iconBtn}>
            <CartIcon className={styles.icon} />
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/home" className={styles.link}>
          <h2>ShopFlow</h2>
        </Link>

        <div className={styles.iconContainer}>
          <Dropdown>
            <Dropdown.Trigger asChild>
              <a className={styles.iconBtn}>
                <ProfileIcon className={styles.icon} />
              </a>
            </Dropdown.Trigger>

            <Dropdown.Content>
              <button onClick={() => navigate("/login")}>Log in</button>
            </Dropdown.Content>
          </Dropdown>

          {WishlistIcon}

          <Link to="/cart" className={styles.iconBtn}>
            <CartIcon className={styles.icon} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
