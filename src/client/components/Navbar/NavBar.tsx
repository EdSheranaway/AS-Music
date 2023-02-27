import { NavLink } from 'react-router-dom';
import styles from './navbar.module.scss';
type Props = {
  user: string | undefined;
};

function NavBar({ user }: Props) {
  return (
    <nav className={styles.navigationContainer}>
      <section className={styles.navigationContainerLeft}>
        <h2>Hi there {user}</h2>
      </section>
      <section className={styles.navigationContainerRight}>
        <ul>
          <li>
            <NavLink to={'/register'}>Register</NavLink>
          </li>
          <li>
            <NavLink to={'/login'}>login</NavLink>
          </li>
          <li>
            <NavLink to={'/'} end>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </section>
    </nav>
  );
}

export default NavBar;
