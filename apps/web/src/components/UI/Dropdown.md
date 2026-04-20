Default trigger

<Dropdown>
  <Dropdown.Trigger>Menu</Dropdown.Trigger>

  <Dropdown.Content>
    <button>Profile</button>
    <button>Settings</button>
  </Dropdown.Content>
</Dropdown>

Custom component trigger

<Dropdown>
  <Dropdown.Trigger asChild>
    <MyButton>Open menu</MyButton>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <button>Profile</button>
  </Dropdown.Content>
</Dropdown>

Icon trigger

<Dropdown>
  <Dropdown.Trigger asChild>
    <span style={{ cursor: "pointer" }}>☰</span>
  </Dropdown.Trigger>

  <Dropdown.Content>
    <button>Profile</button>
  </Dropdown.Content>
</Dropdown>