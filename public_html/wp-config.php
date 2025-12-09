<?php





 // Added by WP Rocket
define('DISALLOW_FILE_EDIT', true);
define('CONCATENATE_SCRIPTS', true);
define('WP_AUTO_UPDATE_CORE', 'minor');
// This setting is required to make sure that WordPress updates can be properly managed in WordPress Toolkit. Remove this line if this WordPress website is not managed by WordPress Toolkit anymore.
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */
// ** MySQL settings ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'nhlstaging_fale1' );
/** MySQL database username */
define( 'DB_USER', 'nhlstaging_fale1' );
/** MySQL database password */
define( 'DB_PASSWORD', 'U[pmZM&72l54G*^hl2&02(@0' );
/** MySQL hostname */
define( 'DB_HOST', 'localhost' );
/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );
/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', '1V(EQz:0#DAkuerl7fBo;L()dP4Ew!2ZD%5b|E1A/O/+%c;GUn08/|Z(2K!K*Zz[');
define('SECURE_AUTH_KEY', '8AJ~|(gQ%AEA/2dl7W*_Ltk[2f+o1&62cY8|p~kC0zb4OQ3)4Xh72t[2U216;cxV');
define('LOGGED_IN_KEY', '*_Kc+Aa8I4Q2+2+~JPmUL!2KN-R&3V|n1SdKH/Ru]R/33@6[Z~(%m3G67s1shBes');
define('NONCE_KEY', '0~DMB|Gbup*4AAU]YvB0*(b]39*v]+umJ4cm*T2xBjN5J1gILT4T]]6m7d3JPA)o');
define('AUTH_SALT', 'kGe5605gDQj7d|;51/54mdZN0[4829r9r+uRF!ezzcMqs)7-e3h_400)7|7hC31u');
define('SECURE_AUTH_SALT', '/m9K#9j;u8R|_3(Df!r&5r4ax7|*kO[nXQ4Zf%5J5n[IF6It3z;[C[2K74*/5a6q');
define('LOGGED_IN_SALT', 'B16Rr(W#J6@a3u!!Ih*Mm[ZB2lu1MK%E|&ed+jl%0:P0/!uF%p936l~#-Th3n14X');
define('NONCE_SALT', 'ehX4Hjs2Efej*47v849Gt@9aL+s72@75f5;8I3@mF/5fi9O6sC@Kj;!s0P#Akbk;');
/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'a75u_';
define('WP_ALLOW_MULTISITE', true);
define( 'DUPLICATOR_AUTH_KEY', 'Zz,x8g@O,>E4}9,(*}TkwFV8Iynt.1qw*]e$I[smu:]E1f&)zrG^BDCD41OPkelj' );
/* That's all, stop editing! Happy blogging. */
/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
#define( 'ALLOW_UNFILTERED_UPLOADS', true );
define('DISALLOW_FILE_MODS', false);