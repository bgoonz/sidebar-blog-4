import React from 'react';
import Router from 'next/router';
import _ from 'lodash';

import { getPageUrl, classNames, Link, withPrefix } from '../utils';
import Action from './Action';
import ActionIcon from './ActionIcon';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.menuOpenRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize, true);
        Router.events.on('routeChangeStart', this.handleRouteChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize, true);
        Router.events.off('routeChangeStart', this.handleRouteChange);
    }

    handleWindowResize() {
        const menuOpenElm = _.get(this.menuOpenRef, 'current.offsetParent');
        if (menuOpenElm === null) {
            document.body.classList.remove('menu--opened');
        }
    }

    handleRouteChange() {
        document.body.classList.remove('menu--opened');
    }

    handleMenuToggle(event) {
        event.preventDefault();
        document.body.classList.toggle('menu--opened');
    }

    renderNavLinks(navLinks, pageUrl) {
        return (
            <a href="https://github.com/bgoonz/sidebar-blog-4" class="github-corner" aria-label="View source on Github"><svg width="80" height="80" viewBox="0 0 250 250" style="z-index:100000;fill:#194ccdaf;color:#fff;position:fixed;top:20px;border:0;left:20px;transform:scale(-1.5, 1.5)" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin:130px 106px" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="red" class="octo-body"></path></svg></a>
            <ul className="menu">
                {_.map(navLinks, (action, index) => {
                    const actionUrl = _.trim(_.get(action, 'url'), '/');
                    return (
                        <li
                            key={index}
                            className={classNames('menu-item', {
                                'current-menu-item': pageUrl === actionUrl
                            })}
                        >
                            <Action action={action} />
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderSocialLinks(socialLinks) {
        return (
            <div className="social-links">
                {_.map(socialLinks, (action, index) => <ActionIcon key={index} action={action} />)}
            </div>
        );
    }

    render() {
        const image = _.get(this.props, 'image');
        const page = _.get(this.props, 'page');
        const pageUrl = _.trim(getPageUrl(page), '/');
        const pageLayout = _.get(page, 'layout');
        const config = _.get(this.props, 'config');
        const header = _.get(config, 'header');
        const logo = _.get(header, 'logo_img');
        const logoAlt = _.get(header, 'logo_img_alt', '');
        const title = _.get(header, 'title');
        const tagline = _.get(header, 'tagline');
        const hasNav = _.get(header, 'has_nav');
        const navLinks = _.get(header, 'nav_links');
        const hasSocial = _.get(header, 'has_social');
        const socialLinks = _.get(header, 'social_links');

        return (
            <header className="site-header">
                {image && (
                    <div className="site-header-bg">
                        <img src={withPrefix(image)} className="site-header-bg-img" alt="" />
                        <div className="site-header-bg-gradient" />
                    </div>
                )}
                <div className="site-header-scroll">
                    <div className="site-header-inside">
                        <div className="site-header-vertical">
                            <div className="site-branding">
                                {logo && <p className="site-logo"><Link href={withPrefix('/')}><img src={withPrefix(logo)} alt={logoAlt} /></Link></p>}
                                {pageLayout === 'home' ? <h1 className="site-title"><Link href={withPrefix('/')}>{title}</Link></h1>
                                    : <p className="site-title"><Link href={withPrefix('/')}>{title}</Link></p>}
                                {tagline && <p className="site-description">{tagline}</p>}
                            </div>
                            {((hasNav && !_.isEmpty(navLinks)) || (hasSocial && !_.isEmpty(socialLinks))) && (
                                <React.Fragment>
                                    <nav id="main-navigation" className="site-navigation" aria-label="Main Navigation">
                                        <div className="site-nav-wrap">
                                            <div className="site-nav-inside">
                                                {hasNav && !_.isEmpty(navLinks) && this.renderNavLinks(navLinks, pageUrl)}
                                                {hasSocial && !_.isEmpty(socialLinks) && this.renderSocialLinks(socialLinks)}
                                            </div>
                                        </div>
                                    </nav>
                                    <button id="menu-toggle" className="menu-toggle" ref={this.menuOpenRef} onClick={this.handleMenuToggle.bind(this)}>
                                        <span className="screen-reader-text">Menu</span>
                                        <span className="icon-menu" aria-hidden="true" />
                                    </button>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}
