import {getDeparts} from "@/api/department";
import {listRoles} from "@/api/user";

export function loadDeparts() {
  if (sessionStorage.getItem('departs')) {
    return JSON.parse(sessionStorage.getItem('departs'))
  } else {
    return getDeparts().then(response => {
      const {page, pages, data, pageSize, total} = response.data
      sessionStorage.setItem('departs', JSON.stringify(data))
      return data
    });
  }
}

export function loadRoles() {
  if (sessionStorage.getItem('roles')) {
    return JSON.parse(sessionStorage.getItem('roles'))
  } else {
    return listRoles({page: 1, limit: 100}).then(response => {
      const {page, pages, data, pageSize, total} = response.data
      sessionStorage.setItem('roles', JSON.stringify(data))
      return data
    });
  }
}

export function getId() {
  var item = sessionStorage.getItem('id');
  if (item) {
    return JSON.parse(item)
  }
  return undefined
}

export function saveId(id) {
  sessionStorage.setItem('id', JSON.stringify(id))
}

export function clearSession() {
  sessionStorage.clear()
}

export function clearDeparts() {
  sessionStorage.removeItem('departs')
}

export function clearRoles() {
  sessionStorage.removeItem('roles')
}
