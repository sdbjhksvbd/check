/*
 * This script makes the Sphinx sidebar collapsible.
 *
 * .sphinxsidebar contains .sphinxsidebarwrapper.  This script adds
 * in .sphixsidebar, after .sphinxsidebarwrapper, the #sidebarbutton
 * used to collapse and expand the sidebar.
 *
 * When the sidebar is collapsed the .sphinxsidebarwrapper is hidden
 * and the width of the sidebar and the margin-left of the document
 * are decreased. When the sidebar is expanded the opposite happens.
 * This script saves a per-browser/per-session cookie used to
 * remember the position of the sidebar among the pages.
 * Once the browser is closed the cookie is deleted and the position
 * reset to the default (expanded).
 *
 */

const initialiseSidebar = () => {
  
    
  

  // global elements used by the functions.
  const bodyWrapper = document.getElementsByClassName("bodywrapper")[0]
  const sidebar = document.getElementsByClassName("sphinxsidebar")[0]
  const sidebarWrapper = document.getElementsByClassName('sphinxsidebarwrapper')[0]
  const sidebarButton = document.getElementById("sidebarbutton")
  const sidebarArrow = sidebarButton.querySelector('span')

  // for some reason, the document has no sidebar; do not run into errors
  if (typeof sidebar === "undefined") return;

  const flipArrow = element => element.innerText = (element.innerText === "Â»") ? "Â«" : "Â»"

  const collapse_sidebar = () => {
    bodyWrapper.style.marginLeft = ".8em";
    sidebar.style.width = ".8em"
    sidebarWrapper.style.display = "none"
    flipArrow(sidebarArrow)
    sidebarButton.title = _('Expand sidebar')
    window.localStorage.setItem("sidebar", "collapsed")
  }

  const expand_sidebar = () => {
    bodyWrapper.style.marginLeft = ""
    sidebar.style.removeProperty("width")
    sidebarWrapper.style.display = ""
    flipArrow(sidebarArrow)
    sidebarButton.title = _('Collapse sidebar')
    window.localStorage.setItem("sidebar", "expanded")
  }

  sidebarButton.addEventListener("click", () => {
    (sidebarWrapper.style.display === "none") ? expand_sidebar() : collapse_sidebar()
  })

  if (!window.localStorage.getItem("sidebar")) return
  const value = window.localStorage.getItem("sidebar")
  if (value === "collapsed") collapse_sidebar();
  else if (value === "expanded") expand_sidebar();
}

if (document.readyState !== "loading") initialiseSidebar()
else document.addEventListener("DOMContentLoaded", initialiseSidebar)