!(function (t, e) {
	var o, n, p, r;
	e.__SV ||
		((window.posthog = e),
		(e._i = []),
		(e.init = function (i, s, a) {
			function g(t, e) {
				var o = e.split(".");
				2 == o.length && ((t = t[o[0]]), (e = o[1])),
					(t[e] = function () {
						t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
					});
			}
			((p = t.createElement("script")).type = "text/javascript"),
				(p.async = !0),
				(p.src = s.api_host + "/static/array.js"),
				(r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
			var u = e;
			for (
				void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
					u.people = u.people || [],
					u.toString = function (t) {
						var e = "posthog";
						return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
					},
					u.people.toString = function () {
						return u.toString(1) + ".people (stub)";
					},
					o =
						"capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(
							" "
						),
					n = 0;
				n < o.length;
				n++
			)
				g(u, o[n]);
			e._i.push([i, s, a]);
		}),
		(e.__SV = 1));
})(document, window.posthog || []);

const getUserId = () => {
	let user_id;
	if (window.localStorage.getItem("user_id")) {
		user_id = JSON.parse(window.localStorage.getItem("user_id"));
	} else {
		user_id = Date.now();
		window.localStorage.setItem("user_id", user_id);
	}
	return [user_id];
};

posthog.init("phc_zDkzQ5TNwVlhTTCaE53xdl5IwdaiQgc3PWbTQY6xSFR", {
	api_host: "https://eu.posthog.com",
	loaded: (posthog) => {
		posthog.identify(getUserId());
		const toolbarJSON = new URLSearchParams(
			window.location.hash.substring(1)
		).get("__posthog");
		if (toolbarJSON) {
			posthog.loadToolbar(JSON.parse(toolbarJSON));
		}
	},
	persistence: "memory",
});
