import styles from "./Footer.module.css"
import Container from "@/components/Containers/Container"

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <div>
            <h3>ShopFlow</h3>
          </div>

          <div>
            <h4>Links</h4>
            <ul>
              <li>Products</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4>Follow</h4>
            <ul>
              <li>Instagram</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          © {new Date().getFullYear()} ShopFlow
        </div>
      </Container>
    </footer>
  )
}

export default Footer