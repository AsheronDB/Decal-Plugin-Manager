<template>
    <div id="settings">

        <div class="wrapper">

            <div class="menu">

                <b-nav pills vertical style="min-width: 2rem">
                    <b-nav-item  exact exact-active-class="active" to="/settings">Decal</b-nav-item>
                    <b-nav-item  exact exact-active-class="active" to="/settings/applications">Application</b-nav-item>
                    <b-nav-item  exact exact-active-class="active" to="/settings/plugins">Plugins</b-nav-item>
                    <b-nav-item  exact exact-active-class="active" to="/settings/about">About</b-nav-item>
                </b-nav>
            </div>
            <div class="content">

                <div class="wrap">
                    <router-view />
                </div>

            </div>

        </div>

    </div>
    </div>
</template>

<style scoped>
#settings {
    height: 100%;
    display: flex;
    flex-direction: column;
}
#settings .wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
}

#settings .wrapper .menu {
    flex: 0 0 300px;
    padding: 20px;
}

#settings .wrapper .content {
    flex: 1 1 auto;
    padding: 20px 0px;
    overflow-y: scroll;
}

#settings .wrapper .content .wrap {
    margin: 0 auto;
    max-width: 80%;
}

.menu {
    background: #666666;
}
</style>